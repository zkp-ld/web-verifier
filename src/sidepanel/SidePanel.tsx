import { Container, Accordion, Code, Button, Space } from '@mantine/core';
import { IconCircleCheck, IconExclamationCircle } from '@tabler/icons-react';
import classes from './SidePanel.module.css';
import { VerifiedVCVP } from '../types/EmbeddedVCVP';

export interface SidePanelProps {
  vcs: VerifiedVCVP[];
  vps: VerifiedVCVP[];
  tab?: chrome.tabs.Tab;
}

export const SidePanel = (props: SidePanelProps) => {
  const handleButtonClick = async () => {
    if (props.tab?.id != undefined) {
      await chrome.tabs.sendMessage(props.tab.id, {
        type: 'EXTRACT',
      });
    }
  };
  const handleMouseEnter = async (elementId: string) => {
    if (props.tab?.id != undefined) {
      await chrome.tabs.sendMessage(props.tab.id, {
        type: 'HIGHLIGHT',
        elementId,
      });
    }
  };
  const handleMouseLeave = async (elementId: string) => {
    if (props.tab?.id != undefined) {
      await chrome.tabs.sendMessage(props.tab.id, {
        type: 'DEHIGHLIGHT',
        elementId,
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Container size="sm">
        <Button fullWidth onClick={() => handleButtonClick()}>
          Verify
        </Button>
        <Space h="md" />
        <Accordion
          chevronPosition="right"
          chevronSize={26}
          variant="separated"
          styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
        >
          {props.vcs.map((vc, i) => (
            <Accordion.Item
              className={classes.item}
              value={vc.elementId}
              key={vc.elementId}
              onMouseEnter={() => handleMouseEnter(vc.elementId)}
              onMouseLeave={() => handleMouseLeave(vc.elementId)}
            >
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
            <Accordion.Item
              className={classes.item}
              value={vp.elementId}
              key={vp.elementId}
              onMouseEnter={() => handleMouseEnter(vp.elementId)}
              onMouseLeave={() => handleMouseLeave(vp.elementId)}
            >
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
