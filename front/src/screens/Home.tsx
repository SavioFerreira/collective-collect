import { Center, Pressable, VStack, Alert, ScrollView,  Heading } from "native-base";

import HandsWorldSvg from '@assets/handsworld.svg';
import LogoHomeSvg from '@assets/coletaColetiva.svg';

import { HomeHeader } from "@components/HomeHeader";
import { HistoryCard } from "@components/HistoryCard";

export function Home() {

  return (
    <VStack flex={1}>
      <HomeHeader />
      <ScrollView>
        <HistoryCard />
        <Center h="32" pt={5}>
          {/* <Heading color="white">
            Coleta Coletiva
          </Heading> */}
          <LogoHomeSvg 
          height={120}
          width={240}
          />
        </Center>
        <Center  h="40">
          <Pressable>
            <HandsWorldSvg
              height={160}
              width={160}
            />
          </Pressable>
        </Center>

      </ScrollView>

    </VStack>
  );
}
