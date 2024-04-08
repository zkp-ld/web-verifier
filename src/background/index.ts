import BUILTIN_DIDDOCS from '../utils/didDocs.json';
import { BUILTIN_CONTEXTS } from '../utils';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      didDocs: JSON.stringify(BUILTIN_DIDDOCS, null, 2),
      contexts: BUILTIN_CONTEXTS,
    });
  }
});
