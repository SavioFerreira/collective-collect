import { useEffect, useState } from 'react';
import { HStack, Heading, Icon, VStack, Text, Image, Box, ScrollView, useToast } from 'native-base';
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

import { Button } from '@components/Button';
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

      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  useEffect(() => {
    fetchColetaDetails();
  }, [user.id]);

  return (
    <VStack flex={1}>
      <VStack px={8} bg="darkBlue.300" pt={10}>
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
        <VStack p={8}>
          <Box>
            <Box rounded="lg" mb={3} overflow="hidden" borderWidth={1}>
              <Image
                w="full"
                h={80}
                source={{ uri: `${api.defaults.baseURL}/colects/${coleta.image}` }}
                alt="imagem da coleta"
                resizeMode="cover"
              />
              <Box bg="blue.700" rounded="md" pb={4} px={4}>
                <HStack alignItems="center" justifyContent="space-around" mb={5} mt={5} borderWidth={1}>
                  <HStack>
                    <SeriesSvg />
                    <Text color="gray.200" ml={2}>
                      {coleta.gravity} gravidade
                    </Text>
                  </HStack>

                  <HStack>
                    <RepetitionsSvg />
                    <Text color="gray.200" ml={2}>
                      {coleta.status} status
                    </Text>
                  </HStack>
                </HStack>
              </Box>
            </Box>
          </Box>


          <Box borderWidth={1} mt={5}  h={250}>
            <Box bg="blue.700" rounded="md" pb={4} px={4}>
              <HStack alignItems="center" justifyContent="space-around" mb={5} mt={5} borderWidth={1}>
                <HStack>
                  <SeriesSvg />
                  <Text color="gray.200" ml={2}>
                    {coleta.gravity} foto antes
                  </Text>
                </HStack>

                <HStack>
                  <RepetitionsSvg />
                  <Text color="gray.200" ml={2}>
                    {coleta.status} foto depois
                  </Text>
                </HStack>
              </HStack>

            </Box>

            <Button
              title="Marcar como realizado"
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}