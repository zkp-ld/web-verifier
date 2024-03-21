import { Title, Container, Accordion, Code } from '@mantine/core';
import { IconCircleCheck, IconExclamationCircle } from '@tabler/icons-react';
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
          chevronSize={26}
          variant="separated"
          styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
        >
          {props.vcs.map((vc, i) => (
            <Accordion.Item className={classes.item} value={`VC${i}`} key={`VC${i}`}>
              <Accordion.Control
                icon={
                  vc.result ? (
                    <IconCircleCheck className={classes.acceptIcon} />
                  ) : (
                    <IconExclamationCircle className={classes.rejectIcon} />
                  )
                }
              >
                {vc.message}
              </Accordion.Control>
              <Accordion.Panel>
                <Accordion
                  chevronPosition="right"
                  chevronSize={26}
                  styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
                >
                  <Accordion.Item value={`VCCODE${i}`} key={`VCCODE${i}`}>
                    <Accordion.Control>code</Accordion.Control>
                    <Accordion.Panel>
                      <Code block>{vc.jsonData ? JSON.stringify(vc.jsonData, null, 2) : ''}</Code>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Accordion.Panel>
            </Accordion.Item>
          ))}

          {props.vps.map((vp, i) => (
            <Accordion.Item className={classes.item} value={`VP${i}`} key={`VP${i}`}>
              <Accordion.Control
                icon={
                  vp.result ? (
                    <IconCircleCheck className={classes.acceptIcon} />
                  ) : (
                    <IconExclamationCircle className={classes.rejectIcon} />
                  )
                }
              >
                {vp.message}
              </Accordion.Control>
              <Accordion.Panel>
                <Accordion
                  chevronPosition="right"
                  chevronSize={26}
                  styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
                >
                  <Accordion.Item value={`VPCODE${i}`} key={`VPCODE${i}`}>
                    <Accordion.Control>code</Accordion.Control>
                    <Accordion.Panel>
                      <Code block>{vp.jsonData ? JSON.stringify(vp.jsonData, null, 2) : ''}</Code>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </div>
  );
};
