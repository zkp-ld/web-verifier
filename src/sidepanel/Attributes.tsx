import { Text, Box, rem, Code } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import classes from './Attributes.module.css';

interface AttributeProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  icon: typeof IconUser;
  title: React.ReactNode;
  description: React.ReactNode;
  code?: boolean;
}

export const Attribute = ({ icon: Icon, title, description, code, ...others }: AttributeProps) => {
  return (
    <div {...others}>
      <div className={classes.wrapper}>
        <Box mr="md">
          <Icon className={classes.icon} style={{ width: rem(24), height: rem(24) }} />
        </Box>
        <Text size="sm" className={classes.title}>
          {title}
        </Text>
      </div>
      {code ? (
        <Code block className={classes.description}>
          {description}
        </Code>
      ) : (
        <Text className={classes.description}>{description}</Text>
      )}
    </div>
  );
};
