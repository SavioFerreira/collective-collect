import { Box, Center, HStack, Heading, VStack } from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";

import RecycleLogoSvg from '@assets/recycleCircle.svg'
import { IconHeader } from "@components/IconHeader";

export function HomeDenuncia() {
  return (
    <VStack flex={1}>
      <IconHeader title="Denuncia"/>

    </VStack>
  );
}
