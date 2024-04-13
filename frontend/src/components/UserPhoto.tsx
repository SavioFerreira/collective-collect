import { IImageProps, Image  } from "native-base";

type Props = IImageProps & {
  size: number;
}
export function UserPhoto({size, ...rest}: Props) {
  return (
    <Image  
      w={size}
      h={size}
      rounded="full"
      borderWidth={3}
      borderColor="darkBlue.200"
      {...rest}
    />
  );
}
