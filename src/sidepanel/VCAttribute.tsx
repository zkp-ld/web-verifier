import { IconCalendar, IconCalendarCancel, IconHomeEdit, IconUser } from '@tabler/icons-react';
import { VCMetadata } from '../types/VCVP';
import Attribute from './Attribute';

interface VCAttributeProps {
  vcMetadata: VCMetadata;
}

const VCAttribute = ({ vcMetadata }: VCAttributeProps) => {
  return (
    <>
      <Attribute
        icon={IconUser}
        title="subject"
        description={JSON.stringify(vcMetadata.subject, null, 2)}
        code
      />
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
    </>
  );
};

export default VCAttribute;
