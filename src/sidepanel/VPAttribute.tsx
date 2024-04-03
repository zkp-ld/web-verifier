import { VPMetadata } from '../types/VCVP';
import Attribute from './Attribute';
import VCAttribute from './VCAttribute';
import { Text } from '@mantine/core';
import { IconCalendar, IconMessage, IconUserEdit } from '@tabler/icons-react';

interface VPAttributeProps {
  vpMetadata: VPMetadata;
}

const VPAttribute = ({ vpMetadata }: VPAttributeProps) => {
  return (
    <>
      <Attribute
        icon={IconMessage}
        title="signed message"
        description={vpMetadata.challenge ?? ''}
      />
      {vpMetadata.holder && (
        <Attribute
          icon={IconUserEdit}
          title="signer"
          description={`${vpMetadata.holder} @ ${vpMetadata.domain}`}
        />
      )}
      {vpMetadata.created && (
        <Attribute icon={IconCalendar} title="signed on" description={vpMetadata.created} />
      )}
      {vpMetadata.boundVCs?.map((vcMetadata, i) => (
        <>
          <Text fw={700}>... and the signer is asserted to have the following credential:</Text>
          <VCAttribute vcMetadata={vcMetadata} key={i} />
        </>
      ))}
      {vpMetadata.unboundVCs?.map((vcMetadata, i) => (
        <>
          <Text fw={700}>... and the following credential is attached as a reference:</Text>
          <VCAttribute vcMetadata={vcMetadata} key={i} />
        </>
      ))}
    </>
  );
};

export default VPAttribute;
