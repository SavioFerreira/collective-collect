import { VStack, ScrollView, Heading, Center, View} from "native-base";

import { IconHeader } from "@components/IconHeader";

export function ValidaColeta() {

  return (
    <VStack flex={1}>
      <IconHeader title="Validação de Coletas" />
      <ScrollView mt={10}>
        <Center>
          <Heading>
            validação - coletas
          </Heading>
        </Center>
      </ScrollView>
    </VStack>
  );
}
