import { Pressable, Text, IPressableProps } from 'native-base';

type Props = IPressableProps & {
    name: string;
    isActive: boolean;
}

export function Group({name, isActive, ...rest}: Props) {
  return (
    <Pressable
      mr={2}
      w={'32'}
      h={10}
      bg="darkBlue.200"
      rounded="md"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      isPressed={isActive}
      _pressed={{
        borderColor: "purple.700",
        borderWidth: 2
      }}
      {...rest}
    >
      <Text
        color={isActive ? "purple.700" : "white"}
        textTransform="uppercase"
        fontSize="sm"
        fontWeight="thin"
      >
        {name}
      </Text>
    </Pressable>
  );
}  