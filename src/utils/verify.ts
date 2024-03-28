import * as jsonld from 'jsonld';
import { VC, verify, verifyProof } from '@zkp-ld/jsonld-proofs';
import didDocs from './didDocs.json';
import { customDocumentLoader } from './documentLoader';
import { CONTEXTS } from './contexts';
import { EmbeddedVCVP, VCMetadata, VPMetadata, VerifiedVC, VerifiedVP } from '../types/VCVP';

// RDF Vocabularies
const CREDS = 'https://www.w3.org/2018/credentials#';
const CREDS_ISSUER = `${CREDS}issuer`;
const CREDS_VC = `${CREDS}verifiableCredential`;
const CREDS_HOLDER = `${CREDS}holder`;
const CREDS_ISSUANCE_DATE = `${CREDS}issuanceDate`;
const CREDS_EXPIRATION_DATE = `${CREDS}expirationDate`;
const CREDS_CREDENTIAL_SUBJECT = `${CREDS}credentialSubject`;
const SECURITY = 'https://w3id.org/security#';
const SECURITY_PROOF = `${SECURITY}proof`;
const SECURITY_DOMAIN = `${SECURITY}domain`;
const SECURITY_CHALLENGE = `${SECURITY}challenge`;
const DCTERMS = 'http://purl.org/dc/terms/';
const DCTERMS_CREATED = `${DCTERMS}created`;

const PPID = 'https://zkp-ld.org/.well-known/genid/';

const documentLoader = customDocumentLoader(new Map(CONTEXTS.map(([k, v]) => [k, JSON.parse(v)])));

export const verifyVCVPs = async (vcs: EmbeddedVCVP[], vps: EmbeddedVCVP[]) => ({
  vcs: await Promise.all(vcs.map(verifyVC)),
  vps: await Promise.all(vps.map(verifyVP)),
});

const verifyVC = async (vc: EmbeddedVCVP): Promise<VerifiedVC> => {
  try {
    if (vc.jsonData == undefined)
      return {
        ...vc,
        result: false,
        error: 'VC is empty',
      };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extendedVC: any = await jsonld.expand(vc.jsonData, { documentLoader, safe: true });
    const vcMetadata = getVCmetadata(extendedVC);
    const result = await verify(vc.jsonData as VC, didDocs, documentLoader);

    return {
      ...vc,
      metadata: vcMetadata,
      result: result.verified,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);

    return {
      ...vc,
      result: false,
      error: e.message,
    };
  }
};

const verifyVP = async (vp: EmbeddedVCVP): Promise<VerifiedVP> => {
  try {
    if (vp.jsonData == undefined)
      return {
        ...vp,
        result: false,
        error: 'VP is empty',
      };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extendedVP: any = await jsonld.expand(vp.jsonData, { documentLoader, safe: true });
    const vpMetadata = getVPmetadata(extendedVP);
    const result = await verifyProof(vp.jsonData, didDocs, documentLoader, {
      challenge: vpMetadata.challenge,
      domain: vpMetadata.domain,
    });

    return {
      ...vp,
      metadata: vpMetadata,
      result: result.verified,
      error: result.error,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);

    return {
      ...vp,
      result: false,
      error: e.message,
    };
  }
};

// get metadata from VC
const getVCmetadata = (vc: any): VCMetadata => ({
  issuer: getIssuer(vc),
  issuanceDate: getIssuanceDate(vc),
  expirationDate: getExpirationDate(vc),
  subject: getCredentialSubject(vc),
});

const getIssuer = (vc: any): string | undefined => vc?.[0]?.[CREDS_ISSUER]?.[0]?.['@id'];

const getIssuanceDate = (vc: any): string | undefined =>
  vc?.[0]?.[CREDS_ISSUANCE_DATE]?.[0]?.['@value'];

const getExpirationDate = (vc: any): string | undefined =>
  vc?.[0]?.[CREDS_EXPIRATION_DATE]?.[0]?.['@value'];

const getCredentialSubject = (vc: any): string | undefined => vc?.[0]?.[CREDS_CREDENTIAL_SUBJECT];

// get metadata from VP
const getVPmetadata = (vp: any): VPMetadata => ({
  domain: getDomain(vp),
  challenge: getChallenge(vp),
  holder: getHolder(vp),
  created: getCreated(vp),
  vcs: getVCs(vp),
});

const getDomain = (vp: any): string | undefined =>
  vp?.[0]?.[SECURITY_PROOF]?.[0]?.['@graph']?.[0]?.[SECURITY_DOMAIN]?.[0]?.['@value'];

const getChallenge = (vp: any): string | undefined =>
  vp?.[0]?.[SECURITY_PROOF]?.[0]?.['@graph']?.[0]?.[SECURITY_CHALLENGE]?.[0]?.['@value'];

const getHolder = (vp: any): string | undefined => {
  const holderWithPrefix = vp?.[0]?.[CREDS_HOLDER]?.[0]?.['@id'];

  return holderWithPrefix?.replace(PPID, 'ppid:');
};

const getCreated = (vp: any): string | undefined =>
  vp?.[0]?.[SECURITY_PROOF]?.[0]?.['@graph']?.[0]?.[DCTERMS_CREATED]?.[0]?.['@value'];

const getVCs = (vp: any): VCMetadata[] => {
  const vcGraphs = vp?.[0]?.[CREDS_VC];
  const vcs = vcGraphs.map((vpGraph: any) => vpGraph?.['@graph']);

  return vcs.map(getVCmetadata);
};
