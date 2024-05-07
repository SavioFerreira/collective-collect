import { Center, Heading, VStack, ScrollView, Image, HStack } from "native-base";
import { IconHeader } from "@components/IconHeader";
import { Input } from "@components/Input";
import BackDenunciaImg from '@assets/mapBackGround.png';
import { Button } from "@components/Button";

import BackgroundImg from '@assets/backColeta.png';

export function HomeDenuncia() {
  return (
    <VStack flex={1}>
      <IconHeader title="Denuncias" />

      <Center py={3}>
        <Heading color="darkBlue.600" fontFamily="heading" fontSize="lg">
          Fazer denúncia
        </Heading>
      </Center>

      <HStack px={5} justifyContent="space-between">
        <Button h={12} w={40} borderWidth={1} borderColor="darkBlue.500" title="Captura" variant="outline" />
        <Button h={12} w={40} borderWidth={1} borderColor="darkBlue.500" title="Gravidade" variant="outline" />
      </HStack>
      
      <VStack flex={1} alignItems="center" justifyContent="center" m={5}>
        <Image
          source={BackDenunciaImg}
          alt="map"
          resizeMode="cover"
          position="absolute"

          width="100%"
          height="100%"
          borderWidth={2}
          borderColor="darkBlue.500"
          borderRadius="lg"
          
        />
      </VStack>

    </VStack>
  );
}