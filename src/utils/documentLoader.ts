import * as jsonld from 'jsonld';
import { Url, RemoteDocument } from 'jsonld/jsonld-spec';

// const remoteDocumentLoader = jsonld.documentLoaders.xhr();

export const customDocumentLoader =
  (documents: Record<string, string>, allowFetch?: boolean) =>
  async (url: Url): Promise<RemoteDocument> => {
    const contextStr = documents[url];
    const context = contextStr ? JSON.parse(contextStr) : undefined;
    if (context) {
      return {
        contextUrl: undefined,
        document: context,
        documentUrl: url,
      };
    }

    // if (allowFetch === true) {
    //   return await remoteDocumentLoader(url);
    // }

    throw new Error(`Error attempted to load document remotely, please cache '${url}'`);
  };
