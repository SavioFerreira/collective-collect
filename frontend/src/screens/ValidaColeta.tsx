import { VStack, ScrollView, Heading, Center } from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";

export function ValidaColeta() {

  return (
    <VStack flex={1}>
      <ScreenHeader title={"Valida Coleta"} />
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
