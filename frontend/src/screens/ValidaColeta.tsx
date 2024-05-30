import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Modal, RefreshControl } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, View, Image, Pressable, Icon, ScrollView, Flex } from "native-base";
import { ResizeMode, Video } from 'expo-av';
import { Fontisto, Feather, Entypo, MaterialIcons } from '@expo/vector-icons';

import { IconHeader } from "@components/IconHeader";
import { ColetaCard } from '@components/ColetaCard';
import { Loading } from '@components/Loading';
import { ColetaDTO } from '@dtos/ColetaDTO';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { StatusEnum } from '@enums/StatusEnum';
import { FormatDate } from '@functions/FormatDate';

import videoPath from '@assets/working-collect.mp4';

export function ValidaColeta() {

  const [isLoading, setIsLoading] = useState(true);
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const video = React.useRef(null);
  const [coleta, setcoleta] = useState<ColetaDTO>({} as ColetaDTO);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuth();

  const collectType = coleta.type !== undefined ? coleta.type.toLocaleLowerCase() : "";
  const collectGravity = coleta.gravity !== undefined ? coleta.gravity.toLocaleLowerCase() : "";
  const pendingVerifyCollect = coletas.filter(collect => collect.status === StatusEnum.EM_ANALISE);

  const collectColaborator =  coleta.collaborators !== undefined ? coleta.collaborators.map(user => user.name).join(', ') : "";
  const collectImageBefore =  coleta.collectImageBefore !== undefined ? coleta.collectImageBefore : "";
  const collectImageAfter = coleta.collectImageAfter !== undefined ? coleta.collectImageAfter : "";
  

  const toast = useToast();

  function openDenunciaModal() {
    setIsModalVisible(true);
  }

  function closeDenunciaModal() {
    setIsModalVisible(!isModalVisible);
  };

  async function fetchColetas() {
    setIsLoading(true);
    try {
      const { data } = await api.get('api/collect');
      setColetas(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes da coleta';
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
      fetchColetas();
    }, [])
  );

  return (
    <VStack flex={1}>
      <IconHeader title="Validação de Coletas" />
      {isLoading ? <Loading /> :
        <View flex={1} m={3}>
          <VStack flex={1} rounded="lg" bgColor="blue.400">
            <HStack m={2} justifyContent="space-evenly">
              <View m={4} />
              <Heading color="white" fontSize="xl" fontFamily="heading" alignSelf="center">
                Verificações Pendentes
              </Heading>
              <Text color="white" fontSize="xl" fontFamily="heading" alignSelf="flex-end">
                {pendingVerifyCollect.length}
              </Text>
            </HStack>
            <VStack mr={2} ml={2} flex={1}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={fetchColetas}
                  />
                }
                data={pendingVerifyCollect}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <ColetaCard onPress={() => { openDenunciaModal(), setcoleta(item) }} data={item} />
                )}
                ListEmptyComponent={() => (
                  <Text color="white" textAlign="center" fontFamily='body' fontSize="md" >
                    Não há coletas disponíveis no momento. {'\n'}Volte mais tarde.
                  </Text>
                )}
                showsVerticalScrollIndicator={false}
              />
            </VStack>
          </VStack>
          <View rounded="xl" overflow="hidden" borderWidth={2} borderColor="blue.600" w="100%" h={300} alignSelf="center" mt={3}>
            <Video
              ref={video}
              source={videoPath}
              isMuted={true}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <View>
            <Modal
              visible={isModalVisible}
              animationType="slide"
              onRequestClose={closeDenunciaModal}
              transparent={true}
            >
              <Flex flex={1} alignItems="center" justifyContent="center" bg="rgba(74, 169, 255, 0.87)">
                <View bgColor="blue.500" p={3} pb={3} justifyContent="flex-end" borderRadius="lg" w="95%" h="98%" shadow={1}>
                  <Icon alignSelf="flex-end" size={8} color="green.400"
                    as={Feather}
                    name="x-circle"
                    onPress={closeDenunciaModal}
                  />
                  <HStack mt={3} flex={1} justifyContent="space-around">

                    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                      <VStack alignSelf="center" justifyContent="space-between">
                        <Heading textAlign="center" color="blue.200" m={2}>
                          Validação coleta nº {coleta.id}
                        </Heading>

                        <HStack bgColor="darkBlue.600" rounded="lg" mr={2} ml={2} justifyContent="space-around">
                          <HStack ml={4} mt={2}>
                            <VStack alignSelf="center">
                              <Icon
                                as={Feather}
                                name={'users'}
                                color="green.400"
                                size="lg"
                                alignSelf="center"
                              />
                              <Text fontFamily="body" fontSize="xs" color="green.400" mb={1}>
                                time
                              </Text>
                            </VStack>
                            <VStack ml={3}>
                              <Text numberOfLines={2} color="blue.200" fontSize="md" textAlign="justify" m={2} mb={3} alignSelf="center">
                                {collectColaborator}
                              </Text>
                            </VStack>
                          </HStack>

                          <HStack ml={4} mt={2}>
                            <VStack alignSelf="center">
                              <Icon
                                as={Entypo}
                                name={'trash'}
                                color="green.400"
                                size="lg"
                                alignSelf="center"
                              />
                              <Text fontFamily="body" fontSize="xs" color="green.400" mb={1}>
                                Tipo
                              </Text>
                            </VStack>
                            <VStack ml={3}>
                              <Text numberOfLines={1} color="blue.200" fontSize="md" textAlign="justify" m={2} mb={3} alignSelf="center">
                                {collectType}
                              </Text>
                            </VStack>
                          </HStack>
                        </HStack>

                        <VStack w={350} h={250} bgColor="red.400" m={2} rounded="lg" >
                          <Text color="white" textAlign="center" fontFamily='body' fontSize="lg" mt={2}>
                            Imagem antes da coleta
                          </Text>
                          <Pressable _pressed={{ opacity: 60 }}>
                            <Image
                              source={{ uri: `${collectImageBefore}`}}
                              alt="imagem Antes"
                              resizeMode="cover"
                              position="absolute"
                              width={350}
                              height={220}
                              borderRadius="lg"
                              borderTopRadius={0}
                              onError={() => { Alert.alert("Erro!", "Ocorreu um erro na renderização da imagem") }}
                            />
                          </Pressable>
                        </VStack>
                        <VStack w={350} h={250} bgColor="green.400" m={2} mt={1} rounded="lg">
                          <Text color="white" textAlign="center" fontFamily='body' fontSize="lg" mt={2}>
                            Imagem Depois da coleta
                          </Text>
                          <Pressable _pressed={{ opacity: 60 }}>
                            <Image
                              source={{ uri: `${collectImageAfter}`}}
                              alt="Imagem depois"
                              resizeMode="cover"
                              position="absolute"
                              width={350}
                              height={220}
                              borderRadius="lg"
                              borderTopRadius={0}
                            />
                          </Pressable>
                        </VStack>
                      </VStack>

                      <HStack bgColor="darkBlue.600" rounded="lg" mr={2} ml={2} mt={1} justifyContent="space-around">

                        <HStack ml={4} mt={2}>
                          <VStack alignSelf="center">
                            <Icon
                              as={Entypo}
                              name={'calendar'}
                              color="green.400"
                              size="lg"
                              alignSelf="center"
                            />
                            <Text fontFamily="body" fontSize="xs" color="green.400" mb={1}>
                              Data
                            </Text>
                          </VStack>
                          <VStack ml={3}>
                            <Text numberOfLines={4} color="blue.200" fontSize="sm" textAlign="justify" m={2} mb={3} alignSelf="center">
                              {FormatDate(coleta.collectDate)}
                            </Text>
                          </VStack>
                        </HStack>

                        <HStack ml={4} mt={2}>
                          <VStack alignSelf="center">
                            <Icon
                              as={MaterialIcons}
                              name={'crisis-alert'}
                              color="green.400"
                              size="lg"
                              alignSelf="center"
                            />
                            <Text fontFamily="body" fontSize="xs" color="green.400" mb={1}>
                              Risco
                            </Text>
                          </VStack>
                          <VStack ml={3}>
                            <Text numberOfLines={4} color="blue.200" fontSize="sm" textAlign="justify" m={2} mb={3} alignSelf="center">
                              {collectGravity}
                            </Text>
                          </VStack>
                        </HStack>
                      </HStack>

                      <HStack justifyContent="space-evenly" m={2} p={2} rounded="lg" bgColor="darkBlue.700">
                        <Pressable onPress={() => { }} _pressed={{ opacity: 60 }}>
                          <Icon as={Fontisto} name="like" size={9} color="green.400" alignSelf="center" />
                          <Text color="green.400" fontSize="lg" >Aprovar</Text>
                        </Pressable>
                        <Pressable onPress={() => { }} _pressed={{ opacity: 60 }}>
                          <Icon as={Fontisto} name="dislike" size={9} color="red.600" alignSelf="center" />
                          <Text color="red.600" fontSize="lg">Reprovar</Text>
                        </Pressable>
                      </HStack>

                    </ScrollView>
                  </HStack>
                </View>
              </Flex>
            </Modal>
          </View>

        </View>
      }
    </VStack >
  );

};
