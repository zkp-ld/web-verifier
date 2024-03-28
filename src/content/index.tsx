import classes from './content.module.css';
import { EmbeddedVCVP } from '../types/EmbeddedVCVP';
import { nanoid } from 'nanoid';

const VC = 'verifiable-credential';
const VP = 'verifiable-presentation';

const getJSONs = async (key: string) => {
  const local = await getLocalJSONs(key);
  const remote = await getRemoteJSONs(key);
  return [...local, ...remote];
};

const getLocalJSONs = async (key: string) => {
  const vcNodes = document.querySelectorAll<HTMLElement>(`.${key}`);

  const jsons = [...vcNodes].map((element) => {
    const ref = element.dataset.ref ? document.querySelector(element.dataset.ref) : undefined;
    const message = element.innerText;
    const elementId = nanoid();
    element.dataset.idForVerification = elementId;

    let jsonData = undefined;
    try {
      if (ref && ref.textContent) {
        jsonData = JSON.parse(ref.textContent);
      }

      return { message, jsonData, elementId };
    } catch (error) {
      console.error('Local JSON parsing error:', error);

      return { error, message, elementId };
    }
  });

  return jsons;
};

const getRemoteJSONs = async (key: string) => {
  const vcNodes = document.querySelectorAll<HTMLAnchorElement>(`a[href$="#${key}"`);

  const fetchPromises = [...vcNodes].map(async (element): Promise<EmbeddedVCVP> => {
    const href = element.href;
    const message = element.innerText;
    const elementId = nanoid();
    element.dataset.idForVerification = elementId;

    try {
      const response = await fetch(href);
      const jsonData = await response.json();

      return { message, jsonData, elementId };
    } catch (error) {
      console.error('Remote JSON fetching error:', error);

      return { error, message, elementId };
    }
  });
  const jsons = await Promise.all(fetchPromises);

  return jsons;
};

const extractVCVPs = async () => {
  const vcs = await getJSONs(VC);
  const vps = await getJSONs(VP);

  const response = await chrome.runtime.sendMessage({
    type: 'VERIFY',
    vcs,
    vps,
  });
};

(async () => await extractVCVPs())();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'EXTRACT') {
    extractVCVPs();
  } else {
    const elementId = request.elementId;
    if (request.type === 'HIGHLIGHT' && elementId != undefined) {
      const element = document.querySelector<HTMLElement>(
        `[data-id-for-verification="${elementId}"]`
      );
      if (element != undefined) {
        element.classList.add(classes.selected);
      }
    } else if (request.type === 'DEHIGHLIGHT' && elementId != undefined) {
      const elementId = request.elementId;
      const element = document.querySelector<HTMLElement>(
        `[data-id-for-verification="${elementId}"]`
      );
      if (element != undefined) {
        element.classList.remove(classes.selected);
      }
    }
  }
});
