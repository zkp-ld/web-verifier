import * as jsonld from 'jsonld';

export interface EmbeddedVCVP {
  message: string;
  elementId: string;
  jsonData?: jsonld.JsonLdDocument;
  error?: unknown;
}

export interface VerifiedVCVP {
  result: boolean;
  message: string;
  elementId: string;
  jsonData?: jsonld.JsonLdDocument;
  error?: unknown;
}
