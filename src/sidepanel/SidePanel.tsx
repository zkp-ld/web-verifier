import { Container, Accordion, Code, Button, Space, Text, Stack } from '@mantine/core';
import { IconCircleCheck, IconExclamationCircle, IconExclamationMark } from '@tabler/icons-react';
import classes from './SidePanel.module.css';
import { VerifiedVC, VerifiedVP } from '../types/VCVP';
import { Attribute } from './Attributes';
import { VCAttribute } from './VCAttribute';
import { VPAttribute } from './VPAttribute';

export interface SidePanelProps {
  vcs: VerifiedVC[];
  vps: VerifiedVP[];
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
          multiple
          styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
        >
          {props.vcs.map((vc) => (
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
                <Stack>
                  <Text fw={700}>
                    with the following{' '}
                    {vc.result ? (
                      'valid'
                    ) : (
                      <Text span fw={700} td="underline">
                        invalid
                      </Text>
                    )}{' '}
                    signature:
                  </Text>
                  {vc.result || (
                    <Attribute
                      icon={IconExclamationMark}
                      title="verification error"
                      description={JSON.parse(JSON.stringify(vc.error)) ?? 'unknown error'}
                    />
                  )}
                  {vc.metadata && <VCAttribute vcMetadata={vc.metadata} />}
                  <Accordion
                    chevronPosition="right"
                    chevronSize={26}
                    styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
                  >
                    <Accordion.Item value={vc.elementId} key={vc.elementId}>
                      <Accordion.Control>raw data</Accordion.Control>
                      <Accordion.Panel>
                        <Code block>{vc.jsonData ? JSON.stringify(vc.jsonData, null, 2) : ''}</Code>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}

          {props.vps.map((vp) => (
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
                <Stack>
                  <Text fw={700}>
                    with the following{' '}
                    {vp.result ? (
                      'valid'
                    ) : (
                      <Text span fw={700} td="underline">
                        invalid
                      </Text>
                    )}{' '}
                    signature:
                  </Text>
                  {vp.result || (
                    <Attribute
                      icon={IconExclamationMark}
                      title="verification error"
                      description={JSON.parse(JSON.stringify(vp.error)) ?? 'unknown error'}
                    />
                  )}
                  {vp.metadata && <VPAttribute vpMetadata={vp.metadata} />}
                  <Accordion
                    chevronPosition="right"
                    chevronSize={26}
                    styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
                  >
                    <Accordion.Item value={vp.elementId} key={vp.elementId}>
                      <Accordion.Control>raw data</Accordion.Control>
                      <Accordion.Panel>
                        <Code block>{vp.jsonData ? JSON.stringify(vp.jsonData, null, 2) : ''}</Code>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </div>
  );
};
