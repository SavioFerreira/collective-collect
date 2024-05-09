import React, { useEffect, useState } from 'react';
import { HStack, Heading, Icon, VStack, Text, Image, Box, ScrollView, useToast, Pressable, View, Center, Flex } from 'native-base';
import { TouchableOpacity, Modal, Button } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ColetaDTO } from '@dtos/ColetaDTO';

import RecicleLogoSvg from '@assets/recycleLogo.svg';

import { getGravityIcon, getStatusIcon, getTypeIcon } from '@utils/Icons';
import { Loading } from '@components/Loading';

import { ColetaCadastro } from '@utils/ColetaCadastro';
import { date } from 'yup';
import { FormatDate } from 'src/functions/FormatDate';

type RouteParamsProps = {
  collectId: string;
}

export function Coleta() {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [coleta, setcoleta] = useState<ColetaDTO>({} as ColetaDTO);
  const route = useRoute();
  const toast = useToast();
  const { collectId } = route.params as RouteParamsProps;

  const gravityIcon = getGravityIcon(coleta.gravity);
  const statusIcon = getStatusIcon(coleta.status);
  const statusTitle = coleta.status != undefined ? coleta.status.toLocaleLowerCase().replace("_", " ") : " ";
  const gravityTitle = coleta.gravity != undefined ? coleta.gravity.toLocaleLowerCase().replace("_", " ") : " ";
  const showDate = FormatDate(coleta?.date);

  const [isModalVisible, SetIsModalVisible] = useState(false);

  function handleGoBack() {
    navigation.navigate('coletas');
  }

  function openColetaModal() {
    SetIsModalVisible(true);
  }

  const closeColetaModal = () => {
    SetIsModalVisible(!isModalVisible);
  };

  async function fetchColetaDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/collect/${collectId}`);
      setcoleta(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercícios';

      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
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
        <ScrollView>
          <VStack p={5} pt={3}>

            <Box rounded="lg" mb={3} overflow="hidden">
              <Box bg="green.700" mt={2} pt={1} pb={2} px={4} borderRadius="lg" borderBottomRadius={0} mb={1}>
                <Text fontFamily="heading" fontSize="md" color="yellow.400" mb={2} alignSelf="center">
                  Titulo da coleta
                </Text>
                <Text minH={3} maxH={16} fontStyle="italic" lineHeight={18} numberOfLines={3} color="warmGray.100" fontSize="md" textAlign="justify" alignSelf="center">
                  {coleta.title}
                </Text>
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
                    source={{ uri: `${coleta.complaintImage}` }}
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
                      onPress={() => {}}
                    >
                    <Icon
                      as={FontAwesome6}
                      name={"map-location-dot"}
                      color="green.400"
                      size={12}
                      mr={2}
                    />
                    </Pressable>
                    <Text color="yellow.200" fontStyle="italic" ml={2} numberOfLines={2}>
                      Local: {coleta.locale}
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
                    {showDate || "Data não disponível"}
                  </Text>
                  <Text fontFamily="body" fontSize="xs" color="yellow.400">
                    Denuncia nº {coleta.complaintId}
                  </Text>
                </HStack>
              </Box>
              <Box bg="green.700" pt={2} pb={2} px={2}>
                <HStack justifyContent="space-around">
                  <HStack>
                    <Icon
                      as={gravityIcon.Component}
                      name={gravityIcon.name}
                      color={gravityIcon.color}
                      size="xl"
                    />
                    <Text color="white" ml={2} alignSelf="center">
                      {gravityTitle.replace(gravityTitle.charAt(0), gravityTitle.charAt(0).toLocaleUpperCase())}
                    </Text>
                  </HStack>

                  <HStack>
                    <Icon
                      as={statusIcon.Component}
                      name={statusIcon.name}
                      color={statusIcon.color}
                      size="lg"
                    />
                    <Text color="white" ml={2} alignSelf="center">
                      {statusTitle.replace(statusTitle.charAt(0), statusTitle.charAt(0).toLocaleUpperCase())}
                    </Text>
                  </HStack>
                </HStack>
              </Box>
            </Box>

            <Pressable
              bgColor="orange.500"
              _pressed={{ bg: "orange.700" }}
              size="20"
              w="full"
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
                    <ColetaCadastro onRegister={closeColetaModal} />
                  </View>
                </Flex>
              </Modal>
            </View>
          </VStack>
        </ScrollView>
      }
    </VStack>
  )
}