import {
  Container,
  Accordion,
  Code,
  Space,
  Text,
  Stack,
  Tooltip,
  ActionIcon,
  Group,
} from '@mantine/core';
import {
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconExclamationMark,
  IconReload,
  IconSettings,
} from '@tabler/icons-react';
import classes from './SidePanel.module.css';
import { VerifiedVC, VerifiedVP } from '../types/VCVP';
import Attribute from './Attribute';
import VCAttribute from './VCAttribute';
import VPAttribute from './VPAttribute';

export interface SidePanelProps {
  vcs: VerifiedVC[];
  vps: VerifiedVP[];
  tab?: chrome.tabs.Tab;
}

const SidePanel = (props: SidePanelProps) => {
  const handleReloadClick = async () => {
    if (props.tab?.id != undefined) {
      await chrome.tabs.sendMessage(props.tab.id, {
        type: 'EXTRACT',
      });
    }
  };
  const handleOptionClick = () => {
    chrome.runtime.openOptionsPage();
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
        <Group justify="center">
          <ActionIcon size="lg" onClick={() => handleReloadClick()}>
            <IconReload style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" onClick={() => handleOptionClick()}>
            <IconSettings style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Group>
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
                    <Tooltip
                      multiline
                      label="The attached signature is correct. Check that the signed credential indeed asserts the content."
                    >
                      <IconExclamationCircle className={classes.warningIcon} />
                    </Tooltip>
                  ) : (
                    <Tooltip label="Failed to verify the signature.">
                      <IconCircleX className={classes.rejectIcon} />
                    </Tooltip>
                  )
                }
              >
                {vc.message}
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <Text fw={700}>
                    The above content comes with the following{' '}
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
                      description={vc.error as string ?? 'unknown error'}
                    />
                  )}
                  {vc.metadata && <VCAttribute vcMetadata={vc.metadata} />}
                  <Accordion
                    chevronPosition="right"
                    chevronSize={26}
                    styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
                  >
                    <Accordion.Item value={vc.elementId} key={vc.elementId}>
                      <Accordion.Control>verifiable credential</Accordion.Control>
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
                    vp.message === vp.metadata?.challenge ? (
                      <Tooltip label="The content has been correctly signed.">
                        <IconCircleCheck className={classes.acceptIcon} />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        multiline
                        label="The attached signature is correct. Check that the signed credential indeed asserts the content."
                      >
                        <IconExclamationCircle className={classes.warningIcon} />
                      </Tooltip>
                    )
                  ) : (
                    <Tooltip label="Failed to verify the signature.">
                      <IconCircleX className={classes.rejectIcon} />
                    </Tooltip>
                  )
                }
              >
                {vp.message}
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <Text fw={700}>
                    The above content comes with the following{' '}
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
                      <Accordion.Control>verifiable presentation</Accordion.Control>
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

export default SidePanel;
