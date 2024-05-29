import { IconHeader } from "@components/IconHeader";
import { VStack, ScrollView, Heading, Center } from "native-base";


export function ValidaDenuncia() {

  return (
    <VStack flex={1}>
      <IconHeader title="Validação de Denuncias" />
      <ScrollView mt={10}>
        <Center>
          <Heading>
            validação - Denuncias
          </Heading>
        </Center>
      </ScrollView>
    </VStack>
  );
}
