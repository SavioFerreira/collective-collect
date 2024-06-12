import React, { useEffect, useState } from 'react';
import { HStack, Heading, Icon, VStack, Text, Image, Box, ScrollView, useToast, Pressable, View, Flex, } from 'native-base';
import { TouchableOpacity, Modal, RefreshControl, Alert } from 'react-native';
import { Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ColetaDTO } from '@dtos/ColetaDTO';

import RecicleLogoSvg from '@assets/recycleLogo.svg';

import { getGravityIcon, getStatusIcon } from 'src/functions/Icons';
import { Loading } from '@components/Loading';

import { FormatDate } from 'src/functions/FormatDate';
import { useAuth } from '@hooks/useAuth';
import { OnCollectModal } from '@functions/OnCollectModal';
import { ColetaCadastroFull } from '@functions/ColetaCadastroFull';
import { ColetaCadastroBasic } from '@functions/ColetaCadastroBasic';
import { StatusEnum } from '@enums/StatusEnum';
import { ChatModal } from '@components/ChatModal';

type RouteParamsProps = {
  collectId: string;
}

export function Coleta() {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [coleta, setcoleta] = useState<ColetaDTO>({} as ColetaDTO);
  const route = useRoute();
  const toast = useToast();

  const { user } = useAuth();
  const { collectId } = route.params as RouteParamsProps;

  const gravityIcon = getGravityIcon(coleta.gravity);
  const statusIcon = getStatusIcon(coleta.status);
  const statusTitle = coleta.status != undefined ? coleta.status.toLocaleLowerCase().replace("_", " ") : " ";
  const gravityTitle = coleta.gravity != undefined ? coleta.gravity.toLocaleLowerCase().replace("_", " ") : " ";
  const showComplaintDate = coleta.complaintDate != undefined || null ? FormatDate(coleta.complaintDate) : "Data não disponível";
  const showCollectDate = coleta.collectDate != undefined || null ? FormatDate(coleta.collectDate) : "Indefinido";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCollectStartVisible, setIsCollectStartVisible] = useState(false);

  const isUserCollaborator = coleta.collaborators?.some(colab => colab.id === user.id);
  const isCollectLeader = coleta?.leaderId === user.id;

  const isCollectCollaboratorEmpy = coleta.collaborators?.filter(user => user).length === 0;
  const isCollectPublic = coleta.teamCollect;

  function handleViewComplaintOnMap(complaintId: string) {
    navigation.navigate('denuncias', { complaintId });
  }

  function handleGoBack() {
    navigation.navigate('coletas');
  }

  function openColetaModal() {
    setIsModalVisible(true);
  }


  const closeColetaModal = () => {
    setIsModalVisible(!isModalVisible);
    fetchColetaDetails();
  };

  async function handleStartCollect() {

    if (coleta.status === "OCORRENDO") setIsCollectStartVisible(true);
    try {
      setIsLoading(true);
      await api.patch(`/api/collect/${collectId}/start`);
      setIsCollectStartVisible(true)
      fetchColetaDetails();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes da coleta';

      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }

  async function fetchColetaDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/collect/${collectId}`);
      setcoleta(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes da coleta';

      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
      handleGoBack();
      
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }

  useEffect(() => {
    fetchColetaDetails();
  }, [collectId]);

  return (
    <VStack flex={1}>
      <VStack px={5} bg="darkBlue.300" pt={10} pb={1}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.700" size={12} pt={1} />
        </TouchableOpacity>

        <HStack justifyContent="space-evenly" alignItems="center">
          <HStack alignItems="center">
            <Heading color="blue.700" fontSize="xl" fontFamily="heading" numberOfLines={1} ml={10} mr={10}>
              Coleta nº{coleta.id}
            </Heading>
            <HStack alignItems="center" >
              <RecicleLogoSvg height={45} width={45} />
            </HStack>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? <Loading /> :
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchColetaDetails}
          />
        }>
          <VStack p={4} pt={3}>

            <Box rounded="lg" mb={3} overflow="hidden">
              <Box bg="green.700" mt={2} pt={1} pb={2} px={4} borderRadius="lg" borderBottomRadius={0} mb={1}>
                <Text fontFamily="heading" fontSize="md" color="yellow.400" mb={2} alignSelf="center">
                  Titulo da coleta
                </Text>
                <Text minH={3} maxH={16} fontStyle="italic" lineHeight={18} numberOfLines={3} color="warmGray.100" fontSize="md" textAlign="justify" alignSelf="center">
                  {coleta.title}
                </Text>
              </Box>
              <Box bg="green.700" mb={1} pt={1} pb={1} px={0}>
                <HStack justifyContent="space-around">
                  <HStack>
                    <Text color="white" mr={2} alignSelf="center" fontSize="xs">
                      Gravidade
                    </Text>
                    <Icon
                      as={gravityIcon.Component}
                      name={gravityIcon.name}
                      color={gravityIcon.color}
                      size="xl"
                    />
                    <Text color={gravityIcon.color} ml={2} alignSelf="center" fontSize="xs">
                      {gravityTitle.replace(gravityTitle.charAt(0), gravityTitle.charAt(0).toLocaleUpperCase())}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text color="white" mr={2} alignSelf="center" fontSize="xs">
                      Status
                    </Text>
                    <Icon
                      as={statusIcon.Component}
                      name={statusIcon.name}
                      color={statusIcon.color}
                      size="lg"
                    />
                    <Text color={statusIcon.color} ml={2} alignSelf="center" fontSize="xs">
                      {statusTitle.replace(statusTitle.charAt(0), statusTitle.charAt(0).toLocaleUpperCase())}
                    </Text>
                  </HStack>
                </HStack>
              </Box>
              <Box position="relative" mb={1}
                minH={80}
                maxH={80}
                minW="full"
                maxW="full">
                {isLoading ? <Loading /> :
                  <Image
                    w="full"
                    h={80}
                    source={{ uri: `${coleta.complaintImage}` || "'https://www.cbde.org.br/images/default.jpg'" }}
                    alt="imagem da coleta"
                    resizeMode="cover"
                    borderWidth={2}
                    borderColor="green.800"
                  />
                }
                <Box position="absolute" bottom={0} left={0} p={3} bgColor="rgba(7, 33, 51, 0.5)" w="full">
                  <HStack alignItems="center">

                    <Pressable
                      _pressed={{
                        opacity: 60
                      }}
                      onPress={() => handleViewComplaintOnMap(coleta.complaintId.toString())}
                    >
                      <Icon
                        as={FontAwesome6}
                        name={"map-location-dot"}
                        color="green.400"
                        size={12}
                        mr={2}
                      />
                    </Pressable>
                    <Text color="yellow.200" fontStyle="italic" ml={1} numberOfLines={2} maxW={'80%'}>
                      Local: {coleta.locale.address}
                    </Text>
                  </HStack>
                </Box>
              </Box>
              <Box bg="green.700" mb={1} pt={2} pb={2} px={4}>

                <Text fontFamily="heading" fontSize="md" color="yellow.400" mb={1}>
                  Descrição:
                </Text>
                <Text minH={10} maxH={20} fontStyle="italic" lineHeight={18} numberOfLines={4} color="warmGray.100" fontSize="md" textAlign="justify">
                  {coleta.description}
                </Text>
                <HStack justifyContent="space-between" mt={1}>
                  <Text fontFamily="body" fontSize="xs" color="yellow.400">
                    {showComplaintDate}
                  </Text>
                  <Text fontFamily="body" fontSize="xs" color="yellow.400">
                    Denuncia nº {coleta.complaintId}
                  </Text>
                </HStack>
              </Box>

              <Box>
                {coleta.collaborators.length > 0 ?
                  <HStack bg="green.700" mb={1} pt={2} pb={1} px={2} flex={1} borderRadius="lg" borderTopRadius={0} justifyContent="space-evenly">
                    <VStack ml={2} mr={2} alignSelf="center">

                      <Icon
                        as={Feather}
                        name={'users'}
                        color="yellow.400"
                        size="lg"
                        alignSelf="center"
                      />
                      <Text fontFamily="body" fontSize="xs" color="yellow.400" mb={1}>
                        Membros
                      </Text>
                    </VStack>
                    <VStack >

                      <Text numberOfLines={4} color="warmGray.100" fontSize="md" textAlign="justify" m={2} mb={3} alignSelf="center">
                        {coleta.collaborators.map(user => user.name.toString()).join(', ')}
                      </Text>
                      <Text numberOfLines={1} color="warmGray.100" fontSize="xs" textAlign="justify" alignSelf="center" fontStyle="italic">
                        Agenda: {showCollectDate}
                      </Text>

                    </VStack>
                    {isUserCollaborator ?
                      <VStack ml={2} mr={2} alignSelf="center">
                        <ChatModal coleta={coleta} />
                      </VStack>
                      :
                      <VStack ml={2} mr={2}></VStack>

                    }

                  </HStack>
                  :
                  <HStack bg="green.700" mb={1} pt={2} pb={1} px={2} flex={1} borderRadius="lg" borderTopRadius={0} justifyContent="space-evenly">
                    <Text fontSize="sm" color="white">
                      Nenhum colaborador
                    </Text>
                  </HStack>

                }
              </Box>
            </Box>

            {!isUserCollaborator && isCollectPublic  && (coleta.status !== (StatusEnum.EM_ANALISE)) && (coleta.status !== (StatusEnum.APROVADO)) ?
              <Pressable
                bgColor="orange.500"
                _pressed={{ bg: "orange.700" }}
                size="20"
                w="100%"
                h={16}
                borderRadius="md"
                alignItems="center"
                justifyContent="center"
                onPress={openColetaModal}
              >
                <Text fontFamily="heading" fontSize="lg" color="white">
                  Cadastrar
                </Text>
              </Pressable>
              :
              ''
            }

            {isCollectLeader && (coleta.status !== StatusEnum.EM_ANALISE) ?
              <HStack justifyContent="space-between">
                { !isCollectStartVisible ?
                  <Pressable
                    w="82%"
                    justifyContent="center"
                    bgColor="blue.500"
                    p={4} borderRadius="md"
                    _pressed={{ bg: "blue.700" }}
                    onPress={() => {
                      Alert.alert(
                        "Iniciar coleta",
                        `Deseja iniciar a coleta agora?`,
                        [
                          {
                            text: "Não",
                            style: "cancel"
                          },
                          {
                            text: "Sim",
                            onPress: handleStartCollect
                          }
                        ]
                      );
                    }}
                  >
                    { coleta.status !== StatusEnum.OCORRENDO && coleta.id.toString() === collectId.toString() &&
                      <Text numberOfLines={1} fontSize={20} fontFamily="heading" color="blue.200" mb={1} textAlign="center">
                        Iniciar Coleta?
                      </Text>
                    }
                    { coleta.status === StatusEnum.OCORRENDO && coleta.id.toString() === collectId.toString() &&
                      <Text numberOfLines={1} fontSize={20} fontFamily="heading" color="blue.200" mb={1} textAlign="center">
                        Retornar para coleta?
                      </Text>
                    }
                  </Pressable>
                  :
                 
                  <View w="82%">
                    { coleta.status === StatusEnum.OCORRENDO &&
                      <OnCollectModal label="Retornar para coleta " collectId={collectId}/>
                    }
                    { coleta.status !== StatusEnum.OCORRENDO &&
                      <OnCollectModal label="Clique para Iniciar " borderWidth={1} borderColor="white" rounded="md" collectId={collectId}/>
                    }
                  </View>
                  
                }
                  <Pressable
                    justifyContent="center"
                    bgColor="blue.500"
                    p={4} borderRadius="md"
                    _pressed={{ bg: "blue.700" }}
                    onPress={() => {
                      coleta.status !== StatusEnum.OCORRENDO ? 
                        openColetaModal() 
                      : 
                        Alert.alert("Atenção!", "Não é possível editar a coleta ocorrendo")}}>
                    <Icon
                      as={Feather}
                      name={'edit'}
                      color="white"
                      size={8}
                      alignSelf="center"
  
                    />
                  </Pressable>
              </HStack>
              :
              ''
            }

            <View>
              <Modal
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={closeColetaModal}
                transparent={true}
              >
                <Flex flex={1} alignItems="center" justifyContent="center" bg="rgba(74, 169, 255, 0.87)">
                  <View bgColor="blue.500" p={5} pb={3} justifyContent="flex-end" borderRadius="lg" w="90%" maxW="90%" h="60%" maxH="70%" shadow={1}>
                    <Icon alignSelf="flex-end" size={8} color="green.400"
                      as={Feather}
                      name="x-circle"
                      onPress={closeColetaModal}
                    />
                    { (isCollectLeader || isCollectCollaboratorEmpy) && coleta.status !== StatusEnum.OCORRENDO ?
                      <ColetaCadastroFull onRegister={closeColetaModal} collectId={coleta.id}/>
                    :
                      <ColetaCadastroBasic onRegister={closeColetaModal} collectId={coleta.id}/>
                    }
                  </View>
                </Flex>
              </Modal>
            </View>

            <View>
            </View>
          </VStack>
        </ScrollView>
      }
    </VStack>
  )
}