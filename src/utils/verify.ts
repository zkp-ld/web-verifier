import { VC, verify, verifyProof } from '@zkp-ld/jsonld-proofs';
import didDocs from './didDocs.json';
import { customDocumentLoader } from './documentLoader';
import { CONTEXTS } from './contexts';
import { EmbeddedVCVP } from '../types/EmbeddedVCVP';

const DEFAULT_DOMAIN = 'example.org';

const documentLoader = customDocumentLoader(new Map(CONTEXTS.map(([k, v]) => [k, JSON.parse(v)])));

export const verifyVCVPs = async (vcs: EmbeddedVCVP[], vps: EmbeddedVCVP[]) => ({
  vcs: await Promise.all(vcs.map(verifyVC)),
  vps: await Promise.all(vps.map(verifyVP)),
});

export const verifyVCs = async (vcs: EmbeddedVCVP[]) => await Promise.all(vcs.map(verifyVC));

export const verifyVPs = async (vps: EmbeddedVCVP[]) => await Promise.all(vps.map(verifyVP));

export const verifyVC = async (vc: EmbeddedVCVP) => {
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

export const verifyVP = async (vp: EmbeddedVCVP) => {
  try {
    if (vp.jsonData == undefined)
      return {
        ...vp,
        result: false,
        error: 'VP is empty',
      };

    const result = await verifyProof(vp.jsonData, didDocs, documentLoader, {
      challenge: vp.message,
      domain: DEFAULT_DOMAIN,
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
