import { Center, VStack, ScrollView, HStack, Icon, Text, View, useToast } from "native-base";

import LogoHomeSvg from '@assets/coletaColetiva.svg';
import { Entypo } from '@expo/vector-icons';
import { HomeHeader } from "@components/HomeHeader";
import { NewsCard } from "@components/NewsCard";
import { ResizeMode, Video } from 'expo-av';

import { Loading } from "@components/Loading";

import videoPath from '@assets/working-collect.mp4';
import React, { useCallback, useState } from "react";
import { ColetaDTO } from "@dtos/ColetaDTO";
import { StatusEnum } from "@enums/StatusEnum";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useFocusEffect } from "@react-navigation/native";

import { RefreshControl } from 'react-native';
import { HistoryCard } from "@components/HistoryCard";

import CoopHomeSvg from '@assets/cooperation.svg';
import WastehomeSvg from '@assets/wasteHome.svg';

export function Home() {

  const video = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const toast = useToast();

  async function handleGetUserContributions() {
    setIsLoading(true);
    try {
      const { data } = await api.get('api/collect');
      setColetas(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar as contribuições';
      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'orange.400'
      })
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      handleGetUserContributions();
    }, [])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      {isLoading ? <Loading /> :
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleGetUserContributions}
          />
        }>
          <NewsCard />
          <VStack h="40%" m={5} rounded="lg" bgColor="blue.400" mb={2} justifyContent="center" alignSelf="center">
            <HStack alignSelf="center" mt={1} flex={1}>
              <HStack alignSelf="center" mr={10}>
                <View >
                <WastehomeSvg width={35} height={35}/>
                </View>
                <Text fontFamily="body" fontSize="md" color="white" ml={2} textAlign="center"  alignSelf="center">
                  Coletas Realizadas
                </Text>
              </HStack>
              <VStack  alignSelf="center">
                <Text numberOfLines={1} color="green.400" fontSize="md" fontFamily="heading" textAlign="justify" alignSelf="center">
                  {coletas.filter(collect => collect.status === StatusEnum.APROVADO).length}
                </Text>
              </VStack>
            </HStack>

            <HStack alignSelf="center" mt={-3} flex={1}>
              <HStack alignSelf="center" mr={5}>
                <View>
                  <CoopHomeSvg width={35} height={35}/>
                </View>
                <Text fontFamily="body" fontSize="md" color="white" ml={2} alignSelf="center">
                  Denuncias Realizadas
                </Text>
              </HStack>
              <VStack alignSelf="center">
                <Text numberOfLines={1} color="red.600" fontFamily="heading" fontSize="md" textAlign="justify" alignSelf="center">
                  {coletas.filter(collect => collect.status === StatusEnum.REJEITADO).length}
                </Text>
              </VStack>
            </HStack>

            <HStack mt={0}>
              <View rounded="lg" borderTopRadius={0} overflow="hidden" w="100%" h={150} alignSelf="center">
                <Video
                  ref={video}
                  onLoad={() => <Loading />}
                  onLoadStart={() => <Loading />}
                  source={videoPath}
                  isMuted={true}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay
                  isLooping
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            </HStack>
          </VStack>
          <VStack px={5} m={5} borderRadius="lg" bg="blue.500">
            <Center h="32">
              <LogoHomeSvg
                height={120}
                width={240}
              />
            </Center>
          </VStack>
        </ScrollView>
      }
    </VStack>
  );
}
