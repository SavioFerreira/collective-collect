import { Pressable, Text, IPressableProps, HStack, Icon } from 'native-base';
import { getTypeIcon } from '@functions/Icons';

type Props = IPressableProps & {
    name: string;
    isActive: boolean;
}

export function Group({name, isActive, ...rest}: Props) {

  const typeIcon = getTypeIcon(name);

  return (
    <Pressable
      mr={2}
      w={'40'}
      h={10}
      bg="darkBlue.700"
      rounded="md"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      isPressed={isActive}
      _pressed={{
        borderColor: "darkBlue.900",
        borderWidth: 2
      }}
      {...rest}
    >
      <HStack>
      <Text
        color={isActive ? "orange.400" : "white"}
        textTransform="uppercase"
        fontSize="sm"
        fontWeight="thin"
        mr={2}
      >
        {name}
      </Text>
      <Icon as={typeIcon.Component} name={typeIcon.name} size={6} color={isActive ? "orange.400" : "white"}/>
      </HStack>

    </Pressable>
  );
}  