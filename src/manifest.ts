import { defineManifest } from '@crxjs/vite-plugin';
import { version } from '../package.json';

// NOTE: do not include src/ in paths,
// vite root folder: src, public folder: public (based on the project root)
// @see ../vite.config.ts#L16

const manifest = defineManifest(async (env) => ({
  manifest_version: 3,
  name: `${env.mode === 'development' ? '[Dev] ' : ''}YourVerifier`,
  description:
    'Enable verifying HTML documents using verifiable credentials and verifiable presentations',
  version,
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', 'file:///*'],
      js: ['content/index.tsx'],
    },
  ],
  action: {
    default_icon: {
      '16': 'images/extension_16.png',
      '32': 'images/extension_32.png',
      '48': 'images/extension_48.png',
      '128': 'images/extension_128.png',
    },
  },
  icons: {
    '16': 'images/extension_16.png',
    '32': 'images/extension_32.png',
    '48': 'images/extension_48.png',
    '128': 'images/extension_128.png',
  },
  side_panel: {
    default_path: 'sidepanel/sidepanel.html',
  },
  permissions: ['activeTab', 'sidePanel'],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'",
  },
}));

export default manifest;
