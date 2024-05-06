import { VStack, ScrollView, Heading, Center } from "native-base";

import { HomeHeader } from "@components/HomeHeader";
import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";

export function ValidaDenuncia() {

  return (
    <VStack flex={1}>
      <ScreenHeader title={"Valida Denuncia"} />
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
