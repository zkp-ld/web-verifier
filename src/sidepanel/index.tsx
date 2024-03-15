import '@mantine/core/styles.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SidePanel } from './SidePanel';
import { MantineProvider } from '@mantine/core';
import { verifyVCVPs } from '../utils/verify';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <MantineProvider>
      <SidePanel vcs={[]} vps={[]} />
    </MantineProvider>
  </React.StrictMode>
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'VERIFY') {
    const vcs = request.vcs != null ? request.vcs : [];
    const vps = request.vps != null ? request.vps : [];

    verifyVCVPs(vcs, vps).then(({ vcs, vps }) => {
      root.render(
        <React.StrictMode>
          <MantineProvider>
            <SidePanel vcs={vcs} vps={vps} />
          </MantineProvider>
        </React.StrictMode>
      );
    });
  }

  return true;
});
