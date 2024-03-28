import * as jsonld from 'jsonld';

export interface EmbeddedVCVP {
  message: string;
  elementId: string;
  jsonData?: jsonld.JsonLdDocument;
  error?: unknown;
}

export interface VerifiedVC {
  result: boolean;
  message: string;
  elementId: string;
  jsonData?: jsonld.JsonLdDocument;
  metadata?: VCMetadata;
  error?: unknown;
}

export interface VCMetadata {
  issuer?: string;
  issuanceDate?: string;
  expirationDate?: string;
  subject?: any;
}

export interface VerifiedVP {
  result: boolean;
  message: string;
  elementId: string;
  jsonData?: jsonld.JsonLdDocument;
  metadata?: VPMetadata;
  error?: unknown;
}

export interface VPMetadata {
  holder?: string;
  created?: string;
  domain?: string;
  challenge?: string;
  boundVCs?: VCMetadata[];
  unboundVCs?: VCMetadata[];
}
