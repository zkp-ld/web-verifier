import { CONTEXTS } from './contexts';
import { customDocumentLoader } from './documentLoader';

export { CONTEXTS, customDocumentLoader };

export const isDev = process.env.NODE_ENV === 'development';
