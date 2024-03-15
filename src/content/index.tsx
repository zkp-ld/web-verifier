import { EmbeddedVCVP } from '../types/EmbeddedVCVP';

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

    let jsonData = undefined;
    try {
      if (ref && ref.textContent) {
        jsonData = JSON.parse(ref.textContent);
      }

      return { message, jsonData };
    } catch (error) {
      console.error('Local JSON parsing error:', error);

      return { error, message };
    }
  });

  return jsons;
};

const getRemoteJSONs = async (key: string) => {
  const vcNodes = document.querySelectorAll<HTMLAnchorElement>(`a[href$="#${key}"`);

  const fetchPromises = [...vcNodes].map(async (element): Promise<EmbeddedVCVP> => {
    const href = element.href;
    const message = element.innerText;

    try {
      const response = await fetch(href);
      const jsonData = await response.json();

      return { message, jsonData };
    } catch (error) {
      console.error('Remote JSON fetching error:', error);

      return { error, message };
    }
  });
  const jsons = await Promise.all(fetchPromises);

  return jsons;
};

(async () => {
  const vcs = await getJSONs(VC);
  const vps = await getJSONs(VP);

  console.log(vcs);
  console.log(vps);

  const response = await chrome.runtime.sendMessage({
    type: 'VERIFY',
    vcs,
    vps,
  });

  console.log(response);
})();
