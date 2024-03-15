import { Title, Container, Accordion, ThemeIcon, rem, JsonInput } from '@mantine/core';
import { IconCheck, IconExclamationMark, IconPlus } from '@tabler/icons-react';
import classes from './SidePanel.module.css';
import { VerifiedVCVP } from '../types/EmbeddedVCVP';

export interface SidePanelProps {
  vcs: VerifiedVCVP[];
  vps: VerifiedVCVP[];
}

export const SidePanel = (props: SidePanelProps) => {
  return (
    <div className={classes.wrapper}>
      <Container size="sm">
        <Title ta="center" className={classes.title}>
          Your Verifier
        </Title>

        <Accordion
          chevronPosition="right"
          defaultValue="reset-password"
          chevronSize={26}
          variant="separated"
          disableChevronRotation
          styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
          chevron={
            <ThemeIcon radius="xl" className={classes.gradient} size={26}>
              <IconPlus style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ThemeIcon>
          }
        >
          {props.vcs.map((vc, i) => (
            <Accordion.Item className={classes.item} value={`VC${i}`} key={`VC${i}`}>
              <Accordion.Control>{vc.message}</Accordion.Control>
              <Accordion.Panel>
                {vc.result ? <IconCheck /> : <IconExclamationMark />}
                <JsonInput value={vc.jsonData ? JSON.stringify(vc.jsonData, null, 2) : ''} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}

          {props.vps.map((vp, i) => (
            <Accordion.Item className={classes.item} value={`VP${i}`} key={`VP${i}`}>
              <Accordion.Control>{vp.message}</Accordion.Control>
              <Accordion.Panel>
                {vp.result ? <IconCheck /> : <IconExclamationMark />}
                <JsonInput value={vp.jsonData ? JSON.stringify(vp.jsonData, null, 2) : ''} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </div>
  );
};
