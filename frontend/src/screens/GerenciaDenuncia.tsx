import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, View } from "native-base";
import { ResizeMode, Video } from 'expo-av';

import { IconHeader } from "@components/IconHeader";
import { Loading } from '@components/Loading';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';

import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import videoPath from '@assets/working-collect.mp4';
import { useAuth } from '@hooks/useAuth';
import { DenunciaCard } from '@components/DenunciaCard';
import { DenunciaDTO } from '@dtos/DenunciaDTO';

export function GerenciaDenuncia() {
  const [isLoading, setIsLoading] = useState(true);
  const [complaint, setComplaint] = useState<DenunciaDTO[]>([]);
  const video = React.useRef(null);
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const toast = useToast();

  function handleOpenComplaintDetail(complaintId: string) {
    navigation.navigate('detalhesDenuncia', { complaintId });
  }

  async function fetchDenuncias() {
    setIsLoading(true);
    try {
      const { data } = await api.get('api/complaint');
      setComplaint(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes da denúncia';
      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchDenuncias();
    }, [])
  );

  return (
    <VStack flex={1}>
      <IconHeader title="Gerenciamento de Denúncias" />
      {isLoading ? <Loading /> :
        <View flex={1} m={3}>
          <VStack h="30%" rounded="lg" bgColor="blue.400" mb={2} justifyContent="space-around">
              <View overflow="hidden" w="100%" h={200} alignSelf="center">
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
          </VStack>

          <VStack flex={1} rounded="lg" bgColor="blue.400">
            <HStack m={2} justifyContent="space-evenly">
              <View m={4} />
              <Heading color="white" fontSize="xl" fontFamily="heading" alignSelf="center">
                Denuncias Disponíveis
              </Heading>
              <Text color="white" fontSize="xl" fontFamily="heading" alignSelf="flex-end">
                {complaint.length}
              </Text>
            </HStack>
            <VStack mr={2} ml={2} flex={1}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={fetchDenuncias}
                  />
                }
                data={complaint}
                keyExtractor={item => item.id?.toString() ?? ''}
                renderItem={({ item }) => (
                  <DenunciaCard data={item} onPress={ () => handleOpenComplaintDetail(item.id?.toString() ?? '')}/>
                )}
                ListEmptyComponent={() => (
                  <Text color="white" textAlign="center" fontFamily='body' fontSize="md" >
                    Não há denúncias para análise no momento. {'\n'}Volte mais tarde.
                  </Text>
                )}
                showsVerticalScrollIndicator={false}
              />
            </VStack>
          </VStack>
        </View>
      }
    </VStack >
  );

};
