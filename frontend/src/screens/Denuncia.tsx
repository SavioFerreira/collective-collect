import { VStack, Image } from "native-base";
import { IconHeader } from "@components/IconHeader";

import BackgroundImg from '@assets/backColeta.png';

export function Denuncia() {
  return (
    <VStack flex={1}>
      <IconHeader title="Denuncia"/>
      <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Céu azul"
          resizeMode="contain"
          position="absolute"
        />
    </VStack>
  );
}
