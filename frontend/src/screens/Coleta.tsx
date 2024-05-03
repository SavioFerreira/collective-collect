import React, { useEffect, useState } from 'react';
import { HStack, Heading, Icon, VStack, Text, Image, Box, ScrollView, useToast, Pressable } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ColetaDTO } from '@dtos/ColetaDTO';

import RepetitionsSvg from '@assets/recycleLogo.svg';

import { getGravityIcon, getStatusIcon, getTypeIcon } from '@utils/Icons';

type RouteParamsProps = {
  collectId: string;
}

export function Coleta() {
  const [coleta, setcoleta] = useState<ColetaDTO>({} as ColetaDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();


  const gravityIcon = getGravityIcon(coleta.gravity);
  const statusIcon = getStatusIcon(coleta.status);
  const typeIcon = getTypeIcon(coleta.type);

  const statusTitle = coleta.status.toLocaleLowerCase().replace("_",  " ");
  const typeTitle = coleta.type.toLocaleLowerCase().replace("_",  " ");
  const gravityTitle = coleta.gravity.toLocaleLowerCase().replace("_",  " ");

  const { collectId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.navigate('coletas');
  }

  async function fetchColetaDetails() {
    try {
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
    }
  }

  useEffect(() => {
    fetchColetaDetails();
  }, [collectId]);

  return (
    <VStack flex={1}>
      <VStack px={5} bg="darkBlue.300" pt={10} pb={2}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.700" size={10} />
        </TouchableOpacity>

        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center">
            <Heading color="white" fontSize="lg" fontFamily="heading" numberOfLines={1} mr={5}>
              Denuncia nº{coleta.complaintId}  do tipo {typeTitle.replace(typeTitle.charAt(0), typeTitle.charAt(0).toLocaleUpperCase())}
            </Heading>
            <Icon
              as={typeIcon.Component}
              name={typeIcon.name}
              color="white"
              size={10}
            />
          </HStack>
        </HStack>
      </VStack>

      <ScrollView>
        <VStack p={5}>

          <Box rounded="lg" mb={3} overflow="hidden">
            <Box position="relative">
              <Image
                w="full"
                h={64}
                source={{ uri: coleta.image }}
                alt="imagem da coleta"
                resizeMode="cover"
                borderWidth={2}
                borderRadius="lg"
                borderBottomRadius={0}
                borderColor="green.800"
              />
              <Box position="absolute" bottom={0} left={0} p={2} bgColor="rgba(7, 33, 51, 0.5)" w="full">
                <HStack maxW={80} minW={80}>
                  <RepetitionsSvg style={{ alignSelf: "center" }} />
                  <Text color="white" fontStyle="italic" ml={2} numberOfLines={2}>
                    Local: {coleta.locale}
                  </Text>
                </HStack>
              </Box>
            </Box>
            <Box bg="green.700" mt={2} pt={2} pb={2} px={4}>

              <Text fontFamily="heading" fontSize="md" color="white" mb={1}>
                Descrição:
              </Text>
              <Text minH={20} maxH={20} fontStyle="italic" lineHeight={18} numberOfLines={4} color="warmGray.100" fontSize="md" textAlign="justify">
                {coleta.description}
              </Text>
            </Box>
            <Box bg="green.700" mt={2} pt={2} pb={2} px={2}>
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
            bgColor="blue.500"
            _pressed={{ bg: "blue.400" }}
            size="20"
            w="full"
            h={16}
            borderRadius="md"
            alignItems="center"
            justifyContent="center"
            onPress={() => { }}
          >
            <Text fontFamily="heading" fontSize="lg" color="white">
              Iniciar Coleta
            </Text>
          </Pressable>


        </VStack>
      </ScrollView>
    </VStack>
  )
}