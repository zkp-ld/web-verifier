import '@mantine/core/styles.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from './Options';
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider>
      <Options />
    </MantineProvider>
  </React.StrictMode>
);
