import { VPMetadata } from '../types/VCVP';
import { Attribute } from './Attributes';
import { VCAttribute } from './VCAttribute';
import { Text } from '@mantine/core';
import { IconCalendar, IconMessage, IconUserEdit } from '@tabler/icons-react';

interface VPAttributeProps {
  vpMetadata: VPMetadata;
}

export const VPAttribute = ({ vpMetadata }: VPAttributeProps) => {
  console.dir(vpMetadata);
  return (
    <>
      <Attribute
        icon={IconMessage}
        title="signed message"
        description={vpMetadata.challenge ?? ''}
      />
      {vpMetadata.holder && (
        <Attribute icon={IconUserEdit} title="signed by" description={vpMetadata.holder} />
      )}
      {vpMetadata.created && (
        <Attribute icon={IconCalendar} title="signed on" description={vpMetadata.created} />
      )}
      {vpMetadata.vcs?.map((vcMetadata, i) => (
        <>
          <Text fw={700}>with attached credential {i}:</Text>
          <VCAttribute vcMetadata={vcMetadata} key={i} />
        </>
      ))}
    </>
  );
};
