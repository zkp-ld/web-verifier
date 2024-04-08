import '@mantine/core/styles.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import SidePanel from './SidePanel';
import { MantineProvider } from '@mantine/core';
import { verifyVCVPs } from '../utils/verify';
import { customDocumentLoader } from '../utils';
import { RemoteDocument, Url } from 'jsonld/jsonld-spec';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <MantineProvider>
      <SidePanel vcs={[]} vps={[]} />
    </MantineProvider>
  </React.StrictMode>
);

let didDocs = {};
let documentLoader: (url: Url) => Promise<RemoteDocument>;

(async () => {
  const data = await chrome.storage.local.get(['didDocs', 'contexts']);
  try {
    didDocs = data.didDocs ? JSON.parse(data.didDocs) : {};
    documentLoader = customDocumentLoader(data.contexts);
  } catch (err) {
    console.error(err);
    didDocs = {};
    documentLoader = customDocumentLoader({});
  }
})();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const tab = sender.tab;

  if (request.type === 'VERIFY' && tab != undefined) {
    const vcs = request.vcs ?? [];
    const vps = request.vps ?? [];

    verifyVCVPs(vcs, vps, didDocs, documentLoader).then(({ vcs, vps }) => {
      root.render(
        <React.StrictMode>
          <MantineProvider>
            <SidePanel vcs={vcs} vps={vps} tab={tab} />
          </MantineProvider>
        </React.StrictMode>
      );
    });
  }
});
