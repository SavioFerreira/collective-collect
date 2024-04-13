import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
  title: string;
  variant?: 'solid' | 'outline';
}
export function Button({title, variant = 'solid', ...rest}: Props) {
  return (
    <ButtonNativeBase 
      w="full"
      h={'16'}
      bg={ variant === "outline" ? "rgba(9, 50, 88, 0.35)" : "green.500"}
      borderWidth={variant === "outline" ? 1.5 : 0}
      borderColor="green.500"

      rounded="sm"
      _pressed={{
        bg: variant === "outline" ? "rgba(9, 50, 88, 0.8)" : "green.700",
        
      }}
      {...rest}
    >
      <Text
        color={"white"}
        fontFamily="heading"
        fontSize="lg"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  )
}