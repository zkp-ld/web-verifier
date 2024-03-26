import * as jsonld from 'jsonld';
import { VC, verify, verifyProof } from '@zkp-ld/jsonld-proofs';
import didDocs from './didDocs.json';
import { customDocumentLoader } from './documentLoader';
import { CONTEXTS } from './contexts';
import { EmbeddedVCVP } from '../types/EmbeddedVCVP';

const SECURITY = 'https://w3id.org/security#';

const documentLoader = customDocumentLoader(new Map(CONTEXTS.map(([k, v]) => [k, JSON.parse(v)])));

export const verifyVCVPs = async (vcs: EmbeddedVCVP[], vps: EmbeddedVCVP[]) => ({
  vcs: await Promise.all(vcs.map(verifyVC)),
  vps: await Promise.all(vps.map(verifyVP)),
});

const verifyVC = async (vc: EmbeddedVCVP) => {
  try {
    if (vc.jsonData == undefined)
      return {
        ...vc,
        result: false,
        error: 'VC is empty',
      };

    const result = await verify(vc.jsonData as VC, didDocs, documentLoader);

    return {
      ...vc,
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

const verifyVP = async (vp: EmbeddedVCVP) => {
  try {
    if (vp.jsonData == undefined)
      return {
        ...vp,
        result: false,
        error: 'VP is empty',
      };

    // auto-detect domain
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extendedVP: any = await jsonld.expand(vp.jsonData, { documentLoader, safe: true });
    console.log(`extendedVP: ${JSON.stringify(extendedVP, null, 2)}`);
    const domain = extendedVP?.[0]?.[`${SECURITY}proof`]?.[0]?.['@graph']?.[0]?.[`${SECURITY}domain`]?.[0]?.['@value'];

    const result = await verifyProof(vp.jsonData, didDocs, documentLoader, {
      challenge: vp.message,
      domain,
    });

    return {
      ...vp,
      result: result.verified,
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
