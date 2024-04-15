import { useEffect, useState } from 'react';
import { Container, JsonInput, Stack, Tabs, Title } from '@mantine/core';
import classes from './Options.module.css';
import { IconBooks, IconKey } from '@tabler/icons-react';
import SelectCreatable from './SelectCreatable';

const Options = () => {
  const [didDocs, setDidDocs] = useState('');
  const [contexts, setContexts] = useState<Record<string, any>>({});
  const [selectedContextKey, setSelectedContextKey] = useState('');
  const [selectedContextValue, setSelectedContextValue] = useState('');
  useEffect(() => {
    (async () => {
      const data = await chrome.storage.local.get(['didDocs', 'contexts']);
      data.didDocs && setDidDocs(data.didDocs);
      data.contexts && setContexts(data.contexts);
    })();
  }, []);

  const handleDidDocsUpdate = (updated: string) => {
    try {
      chrome.storage.local.set({ didDocs: updated });
      setDidDocs(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleContextValueUpdate = (updated: string, context: string) => {
    const updatedContexts = { ...contexts, [context]: updated };
    chrome.storage.local.set({ contexts: updatedContexts });
    setContexts(updatedContexts);
    setSelectedContextValue(updated);
  };

  const handleContextKeyChange = (changed: string) => {
    const contextValue = contexts[changed];
    setSelectedContextKey(changed);
    setSelectedContextValue(contextValue);
  };

  return (
    <div className={classes.wrapper}>
      <Container size="sm">
        <Title size="lg" className={classes.title}>
          YourVerifier options
        </Title>
        <Tabs variant="outline" defaultValue="diddocs">
          <Tabs.List>
            <Tabs.Tab value="diddocs" leftSection={<IconKey />} className={classes.tab}>
              DID documents
            </Tabs.Tab>
            <Tabs.Tab value="contexts" leftSection={<IconBooks />} className={classes.tab}>
              JSON-LD contexts
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="diddocs">
            <JsonInput
              classNames={{ label: classes.label, error: classes.error }}
              validationError="Invalid JSON"
              value={didDocs}
              autosize
              minRows={10}
              maxRows={30}
              onChange={handleDidDocsUpdate}
            />
          </Tabs.Panel>

          <Tabs.Panel value="contexts">
            <Stack>
              <SelectCreatable
                keys={contexts ? Object.keys(contexts) : []}
                onSelect={handleContextKeyChange}
              />
              <JsonInput
                classNames={{ label: classes.label, error: classes.error }}
                validationError="Invalid JSON"
                value={selectedContextValue}
                autosize
                minRows={10}
                maxRows={30}
                onChange={(changed) => handleContextValueUpdate(changed, selectedContextKey)}
              />
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </div>
  );
};

export default Options;
