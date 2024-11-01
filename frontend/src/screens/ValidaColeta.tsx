import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Modal, RefreshControl } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, View, Image, Pressable, Icon, ScrollView } from "native-base";
import { ResizeMode, Video } from 'expo-av';
import { Fontisto, Feather, Entypo, MaterialIcons } from '@expo/vector-icons';

import { IconHeader } from "@components/IconHeader";
import { ColetaCard } from '@components/ColetaCard';
import { Loading } from '@components/Loading';
import { ColetaDTO } from '@dtos/ColetaDTO';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { StatusEnum } from '@enums/StatusEnum';
import { FormatDate } from '@functions/FormatDate';

import videoPath from '@assets/working-collect.mp4';
import { useAuth } from '@hooks/useAuth';
import { Input } from '@components/Input';

export function ValidaColeta() {
  const [isLoading, setIsLoading] = useState(true);
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const video = React.useRef(null);
  const [coleta, setcoleta] = useState<ColetaDTO>({} as ColetaDTO);
  const [message, setMessage] = useState<string>();
  const [isRequestMessage, setIsRequestMessage] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuth();
  const collectType = coleta.type !== undefined ? coleta.type.toLocaleLowerCase() : "";
  const pendingVerifyCollect = coletas.filter(collect => collect.status === StatusEnum.EM_ANALISE);

  const collectColaborator = coleta.collaborators !== undefined ? coleta.collaborators.map(user => user.name).join(', ') : "";
  const collectAddress = coleta.locale?.address !== undefined ? coleta.locale.address : "";
  const collectImageBefore = coleta.collectImageBefore !== undefined ? coleta.collectImageBefore : "";
  const collectImageAfter = coleta.collectImageAfter !== undefined ? coleta.collectImageAfter : "";

  const toast = useToast();

  function openDenunciaModal() {
    setIsModalVisible(true);
  }

  function closeDenunciaModal() {
    setIsRequestMessage(false)
    setIsModalVisible(!isModalVisible);
  };

  async function handleValidadeCollect(statusValue: StatusEnum) {
    setIsLoading(true);
    setIsRequestMessage(false)

    let payload;
    if (statusValue === StatusEnum.APROVADO) {
      payload = JSON.stringify({ status: StatusEnum.APROVADO, message: 'Aprovado' });
    }
    else if (statusValue === StatusEnum.REJEITADO) {
      payload = JSON.stringify({ status: StatusEnum.REJEITADO, message: message });
    }
    try {
      await api.patch(`api/collect/${coleta.id}/validate`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      fetchColetas();
      setMessage(undefined);
      closeDenunciaModal();
      toast.show({
        title: "Coleta " + coleta.id + " validada com sucesso!\n" + "Obrigado " + user.name,
        placement: 'top',
        bgColor: 'green.500',
      })
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Ocorreu um erro ao finalizar a validação.\n Tente novamente';

      closeDenunciaModal();
      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

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
          <VStack h="40%" rounded="lg" bgColor="blue.400" mb={2} justifyContent="space-around">
            <VStack flex={1} justifyContent="space-evenly">
              <HStack alignSelf="center">
                <HStack alignSelf="center">
                  <Icon
                    as={Entypo}
                    name={'emoji-happy'}
                    color="green.400"
                    size="lg"
                    alignSelf="center"
                    mr={1}
                  />
                  <Text fontFamily="body" fontSize="md" color="white">
                    Total de coletas aprovadas
                  </Text>
                </HStack>
                <VStack ml={2}>
                  <Text numberOfLines={1} color="green.400" fontSize="md" fontFamily="heading" textAlign="justify" alignSelf="center">
                    {coletas.filter(collect => collect.status === StatusEnum.APROVADO).length}
                  </Text>
                </VStack>
              </HStack>

              <HStack alignSelf="center">
                <HStack alignSelf="center">
                  <Icon
                    as={Entypo}
                    name={'emoji-sad'}
                    color="red.600"
                    size="lg"
                    alignSelf="center"
                    mr={2}
                  />
                  <Text fontFamily="body" fontSize="md" color="white">
                    Total de coletas rejeitadas
                  </Text>
                </HStack>
                <VStack ml={2}>
                  <Text numberOfLines={1} color="red.600" fontFamily="heading" fontSize="md" textAlign="justify" alignSelf="center">
                    {coletas.filter(collect => collect.status === StatusEnum.REJEITADO).length}
                  </Text>
                </VStack>
              </HStack>
            </VStack>

            <HStack mt={0}>
              <View rounded="lg" borderTopRadius={0} overflow="hidden" w="100%" h={190} alignSelf="center">
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
                    Não há coletas para análise no momento. {'\n'}Volte mais tarde.
                  </Text>
                )}
                showsVerticalScrollIndicator={false}
              />
            </VStack>
          </VStack>

          <View>
            <Modal
              visible={isModalVisible}
              animationType="fade"
              onRequestClose={closeDenunciaModal}
              transparent={true}
            >
              <View flex={1} bg="rgba(74, 169, 255, 0.87)">
                <VStack flex={1} bgColor="blue.500" pb={2} >

                  <HStack justifyContent="space-between" mt={5} mr={3} ml={3}>
                    <HStack>
                      <VStack alignSelf="center" mr={2}>
                        <Icon
                          as={Entypo}
                          name={'calendar'}
                          color="green.400"
                          size={8}
                          alignSelf="center"
                        />
                      </VStack>
                      <VStack alignSelf="center">
                        <Text numberOfLines={1} color="blue.200" fontSize="sm" alignSelf="center">
                          {FormatDate(coleta.collectDate)}
                        </Text>
                      </VStack>
                    </HStack>
                    <Icon alignSelf="flex-end" size={8} color="green.400"
                      as={Feather}
                      name="x-circle"
                      onPress={closeDenunciaModal}
                    />
                  </HStack>
                  {isLoading ? <Loading /> :
                    <HStack flex={1} justifyContent="space-around">
                      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                        <Heading textAlign="center" color="blue.200" m={2}>
                          Validação coleta nº {coleta.id}
                        </Heading>

                        <HStack bgColor="darkBlue.600" rounded="lg" justifyContent="space-around" mr={3} ml={3} mb={2}>
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
                              <Text numberOfLines={1} color="blue.200" fontSize="md" textAlign="justify" m={2} mb={2} alignSelf="center">
                                {collectType}
                              </Text>
                            </VStack>
                          </HStack>
                        </HStack>
                        <HStack bgColor="darkBlue.600" rounded="lg" mr={3} ml={3} mb={2} justifyContent="space-between">
                          <VStack alignSelf="center" ml={5} mt={2} mb={1}>
                            <Icon
                              as={MaterialIcons}
                              name={'crisis-alert'}
                              color="green.400"
                              size="lg"
                              alignSelf="center"
                            />
                            <Text fontFamily="body" fontSize="xs" color="green.400">
                              Endereço
                            </Text>
                          </VStack>
                          <VStack alignSelf="center" mr={2} ml={-3}>
                            <Text numberOfLines={1} maxW="87%" minW="87%" color="blue.200" fontSize="sm" textAlign="justify" alignSelf="center">
                              {collectAddress}
                            </Text>
                          </VStack>
                        </HStack>

                        <VStack flex={1} mr={3} ml={3}>
                          <VStack w="full" h={250} bgColor="red.400" rounded="lg" mb={3} >
                            <Text color="white" textAlign="center" fontFamily='body' fontSize="lg" mt={2}>
                              Imagem antes da coleta
                            </Text>
                            <Pressable _pressed={{ opacity: 60 }}>
                              <Image
                                source={{ uri: `${collectImageBefore}` }}
                                alt="imagem Antes"
                                resizeMode="cover"
                                position="absolute"
                                width="full"
                                height={216}
                                borderRadius="lg"
                                borderTopRadius={0}
                                onError={() => { Alert.alert("Erro!", "Ocorreu um erro na renderização da imagem") }}
                              />
                            </Pressable>
                          </VStack>
                          <VStack w="full" h={250} bgColor="green.400" rounded="lg" mb={2}>
                            <Text color="white" textAlign="center" fontFamily='body' fontSize="lg" mt={2}>
                              Imagem Depois da coleta
                            </Text>
                            <Pressable _pressed={{ opacity: 60 }}>
                              <Image
                                source={{ uri: `${collectImageAfter}` }}
                                alt="Imagem depois"
                                resizeMode="cover"
                                position="absolute"
                                width="full"
                                height={216}
                                borderRadius="lg"
                                borderTopRadius={0}
                              />
                            </Pressable>
                          </VStack>
                        </VStack>

                        {isRequestMessage &&
                          <VStack bgColor="darkBlue.600" rounded="lg" justifyContent="start" mr={3} ml={3} mb={2} isFocused={isRequestMessage}>
                            <HStack ml={4}>
                              <VStack alignSelf="start" mr={4} mt={2}>
                                <Icon
                                  as={Feather}
                                  name={'users'}
                                  color="green.400"
                                  size="lg"
                                  alignSelf="center"
                                />
                                <Text fontFamily="body" fontSize="xs" color="green.400" mb={1}>
                                  Motivo
                                </Text>
                              </VStack>
                            </HStack>
                            <Input placeholder="Mensagem" bg="blue.400" numberOfLines={4} mr={2} ml={2} h={12} isDisabled={isRequestMessage} onChangeText={setMessage} />
                          </VStack>
                        }

                        <HStack justifyContent="space-evenly" mr={3} ml={3} p={2} rounded="lg" bgColor="darkBlue.700" isDisabled={isLoading}>
                          <Pressable onPress={() => {
                            Alert.alert(
                              "Confirmação!",
                              `Deseja aprovar essa coleta?`,
                              [
                                {
                                  text: "Não",
                                  style: "cancel"
                                },
                                {
                                  text: "Sim",
                                  onPress: () => { handleValidadeCollect(StatusEnum.APROVADO) }
                                }
                              ]
                            );
                          }} _pressed={{ opacity: 60 }}>
                            <Icon as={Fontisto} name="like" size={9} color="green.400" alignSelf="center" />
                            <Text color="green.400" fontSize="lg" >Aprovar</Text>
                          </Pressable>
                          <Pressable onPress={() => {
                            Alert.alert(
                              "Confirmação!",
                              `Deseja rejeitar essa coleta?`,
                              [
                                {
                                  text: "Não",
                                  style: "cancel"
                                },
                                {
                                  text: "Sim",
                                  onPress: () => {
                                    setIsRequestMessage(true)
                                    {
                                      (message?.length !== undefined && message?.length > 5) ?
                                      handleValidadeCollect(StatusEnum.REJEITADO)
                                      :
                                      Alert.alert("Atenção!", "Inclua o motivo da rejeição da coleta");
                                    }
                                  }
                                }
                              ]
                            );
                          }} _pressed={{ opacity: 60 }}>
                            <Icon as={Fontisto} name="dislike" size={9} color="red.600" alignSelf="center" />
                            <Text color="red.600" fontSize="lg">Reprovar</Text>
                          </Pressable>
                        </HStack>

                      </ScrollView>
                    </HStack>
                  }
                </VStack>
              </View>
            </Modal>
          </View>

        </View>
      }
    </VStack >
  );

};
