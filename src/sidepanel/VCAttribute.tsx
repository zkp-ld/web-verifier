import { IconCalendar, IconCalendarCancel, IconHomeEdit, IconUser } from '@tabler/icons-react';
import { VCMetadata } from '../types/VCVP';
import { Attribute } from './Attributes';

interface VCAttributeProps {
  vcMetadata: VCMetadata;
}

export const VCAttribute = ({ vcMetadata }: VCAttributeProps) => {
  return (
    <>
      {vcMetadata.issuer && (
        <Attribute icon={IconHomeEdit} title="issued by" description={vcMetadata.issuer} />
      )}
      {vcMetadata.issuanceDate && (
        <Attribute icon={IconCalendar} title="issued on" description={vcMetadata.issuanceDate} />
      )}
      {vcMetadata.expirationDate && (
        <Attribute
          icon={IconCalendarCancel}
          title="expired on"
          description={vcMetadata.expirationDate}
        />
      )}
      <Attribute
        icon={IconUser}
        title="subject"
        description={JSON.stringify(vcMetadata.subject, null, 2)}
        code
      />
    </>
  );
};
