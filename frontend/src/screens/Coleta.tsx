import { useEffect, useState } from 'react';
import { HStack, Heading, Icon, VStack, Text, Image, Box, ScrollView, useToast } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ColetaDTO } from '@dtos/ColetaDTO';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';

import { Button } from '@components/Button';

type RouteParamsProps = {
  exerciseId: string;
}

export function Coleta() {
  const [coleta, setcoleta] = useState<ColetaDTO>({} as ColetaDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();

  const { exerciseId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
    }

    async function fetchColetaDetails() {
      try {
        const response = await api.get(`/collects/${exerciseId}`);
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
    }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={10}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={8}/>
        </TouchableOpacity>

        <HStack justifyContent="space-between" mt={6} mb={8} alignItems="center">
          <Heading color="gray.100" fontSize="lg" fontFamily="heading" flexShrink={1}>
            {coleta.title}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="gray.200" ml={1} textTransform="capitalize">
              {coleta.type}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView>
        <VStack p={8}>
          <Box  rounded="lg" mb={3} overflow="hidden">
            <Image 
              w="full"
              h={80}
              source={{ uri: `${api.defaults.baseURL}/colects/${coleta.image}`}}
              alt="imagem da coleta"
              resizeMode="cover"
            />
          </Box>

          <Box bg="gray.600" rounded="md" pb={4} px={4}>
            <HStack alignItems="center" justifyContent="space-around" mb={5} mt={5}>
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
  
            <Button 
              title="Marcar como realizado"
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  ) 
}