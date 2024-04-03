import { useEffect, useState } from 'react';
import { Container, JsonInput, Title } from '@mantine/core';
import classes from './Options.module.css';

const Options = () => {
  const [didDocs, setDidDocs] = useState('');
  useEffect(() => {
    (async () => {
      const data = await chrome.storage.local.get('didDocs');
      setDidDocs(data.didDocs);
    })();
  }, []);

  const handleChange = (changed: string) => {
    chrome.storage.local.set({ didDocs: changed });
    setDidDocs(changed);
  };

  return (
    <div className={classes.wrapper}>
      <Container size="sm">
        <Title size="lg" className={classes.title}>
          YourVerifier options
        </Title>
        <JsonInput
          classNames={{ label: classes.label, error: classes.error }}
          label="DID documents"
          validationError="Invalid JSON"
          value={didDocs}
          autosize
          minRows={10}
          onChange={handleChange}
        />
      </Container>
    </div>
  );
};

export default Options;
