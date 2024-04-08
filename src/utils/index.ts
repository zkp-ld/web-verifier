import { BUILTIN_CONTEXTS } from './contexts';
import { customDocumentLoader } from './documentLoader';

export { BUILTIN_CONTEXTS, customDocumentLoader };

export const isDev = process.env.NODE_ENV === 'development';
