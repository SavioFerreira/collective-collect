import React, { useEffect, useState } from 'react';
import { HStack, Heading, Icon, VStack, Text, Image, Box, ScrollView, useToast, Button, Pressable } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ColetaDTO } from '@dtos/ColetaDTO';

import RecicleLogoSvg from '@assets/recycleLogo.svg';
import SeriesSvg from '@assets/recycleLogo.svg';
import RepetitionsSvg from '@assets/recycleLogo.svg';

import { useAuth } from '@hooks/useAuth';
import { IconHeader } from '@components/IconHeader';

// type RouteParamsProps = {
//   exerciseId: string;
// }

export function Coleta() {
  const [coleta, setcoleta] = useState<ColetaDTO>({} as ColetaDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();

  const { user } = useAuth();

  //const { exerciseId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.navigate('coletas');
  }

  async function fetchColetaDetails() {
    try {
      const response = await api.get(`/collects/${user.id}`);
      setcoleta(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercícios';

      // toast.show({
      //   title: title,
      //   placement: 'top',
      //   bgColor: 'red.500'
      // })
    }
  }

  useEffect(() => {
    fetchColetaDetails();
  }, [user.id]);

  return (
    <VStack flex={1}>
      <VStack px={8} bg="darkBlue.300" pt={10} pb={2}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.700" size={10} />
        </TouchableOpacity>

        <HStack justifyContent="space-between" alignItems="center">
          <Heading color="white" fontSize="xl" fontFamily="heading" flexShrink={1}>
            {coleta.title}
            Titulo da coleta
          </Heading>

          <HStack alignItems="center">
            <RecicleLogoSvg height={50} width={50} />

            <Text color="white" ml={3} textTransform="capitalize">
              {coleta.type}
              tipo da coleta
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView>
        <VStack p={5}>

          <Box rounded="lg" mb={3} overflow="hidden">
            <Box position="relative">
              <Image
                w="full"
                h={80}
                source={{ uri: "https://www.aparecida.go.gov.br/wp-content/uploads/2021/06/LIMPEZA-DE-ENTULHOS-ENIO-MEDEIROS-7-SITE-1.jpg" }}
                alt="imagem da coleta"
                resizeMode="cover"
                borderWidth={2}
                borderRadius="lg"
                borderBottomRadius={0}
                borderColor="green.800"
              />
              <Box position="absolute" bottom={0} left={0} p={2} bgColor="rgba(7, 33, 51, 0.3)" w="full">
                <HStack maxW={80} minW={80}>
                  <RepetitionsSvg  style={{alignSelf: "center"}}/>
                  <Text color="white" fontStyle="italic" ml={2} numberOfLines={2}>
                    Local: {coleta.locale} Rua Tamarindo oliveira quadra 12 lote 20.
                  </Text>
                </HStack>
              </Box>
            </Box>
            <Box bg="green.700" mt={2} pt={2} pb={2} px={4}>

              <Text fontFamily="heading" color="white" mb={1}>
                Descrição:
              </Text>
              <Text fontStyle="italic" lineHeight={18} numberOfLines={4} color="warmGray.100">
                intulhos descartados indevidamente no lote ao lado de casa. intulhos descartados indevidamente no lote ao lado de casa.
              </Text>
            </Box>
            <Box bg="green.700" mt={2} pt={2} pb={2} px={2}>
              <HStack justifyContent="space-around">
                <HStack>
                  <SeriesSvg />
                  <Text color="white" ml={1}>
                    {coleta.gravity} gravidade
                  </Text>
                </HStack>

                <HStack>
                  <RepetitionsSvg />
                  <Text color="white" ml={1}>
                    {coleta.status} status
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