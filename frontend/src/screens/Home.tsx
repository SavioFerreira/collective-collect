import { Center, Pressable, VStack, Alert, ScrollView, Image } from "native-base";

import LogoHomeSvg from '@assets/coletaColetiva.svg';
import BackHomeImg from '@assets/homeBackImage.png';

import { HomeHeader } from "@components/HomeHeader";
import { HistoryCard } from "@components/HistoryCard";
import { NewsCard } from "@components/NewsCard";

export function Home() {

  return (
    <VStack flex={1}>
      <HomeHeader />
      <ScrollView>
        <NewsCard />
        <HistoryCard />
        <VStack px={5} m={5} borderRadius="lg" bg="blue.500">
          <Center h="32">
            <LogoHomeSvg
              height={120}
              width={240}
            />
          </Center>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
