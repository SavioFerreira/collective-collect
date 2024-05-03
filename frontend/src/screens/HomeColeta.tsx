import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, Icon } from "native-base";

import { Entypo } from '@expo/vector-icons';
import { ColetaDTO } from '@dtos/ColetaDTO';
import { api } from '@services/api'

import { IconHeader } from "@components/IconHeader";
import { Group } from '@components/Group';
import { ColetaCard } from '@components/ColetaCard';
import { Loading } from '@components/Loading';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ResiduoType } from 'src/enums/ResiduoType';
import { AppError } from '@utils/AppError';

export function HomeColeta() {

  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState(Object.values(ResiduoType));
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const [allColetas, setAllColetas] = useState<ColetaDTO[]>([]);

  const [typeSelected, setTypeSelected] = useState(types[0]);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  function handleOpenColetaDetails(collectId: string) {
    navigation.navigate('detalhesColeta', {collectId});
  }

  const applyFilter = useCallback(() => {
    const filteredColetas = typeSelected === ResiduoType.TODOS ? allColetas : allColetas.filter(coleta => coleta.type === typeSelected);
    setColetas(filteredColetas);
  }, [typeSelected, allColetas]);

  const handleTypeSelected = useCallback((item: ResiduoType) => {
    setTypeSelected(item);
  }, []);

  useEffect(() => {
    applyFilter();
  }, [typeSelected, applyFilter]);

  async function fetchColetas() {
    setIsLoading(true);
    try {
      const { data } = await api.get('api/collect');
      setAllColetas(data);
      applyFilter();
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

  useFocusEffect(
    useCallback(() => {
      fetchColetas();
    }, [])
  );


  return (
    <VStack flex={1} >
      <IconHeader title="Coletas" />

      <VStack px={2} py={2} backgroundColor={'blue.500'} m={4} borderRadius="lg">
        <HStack justifyContent="space-between">
          <Heading color="darkBlue.700" fontSize="xl" fontFamily="heading" mb={2} ml={'24'}>
            Tipos de resíduo
          </Heading>
          <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
            <Icon
              as={Entypo}
              name="help-with-circle"
              color="darkBlue.700"
              size={7}
            />
          </TouchableOpacity>
        </HStack>
        <FlatList
          data={types}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Group
              name={item}
              isActive={typeSelected === item}
              onPress={() => handleTypeSelected(item)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{
            px: 5,
          }}
          my={16}
          maxH={16}
          mb={1} mt={1}
        />
      </VStack>

      {isLoading ? <Loading /> :
        <VStack flex={1} px={1} backgroundColor={'blue.500'} m={4} borderRadius="lg">
          <HStack justifyContent="space-between" m={4}>
            <Heading color="darkBlue.700" fontSize="lg" fontFamily="heading">
              Coletas disponíveis
            </Heading>
            <Text color="darkBlue.700" fontSize="lg" fontFamily="heading">
              {coletas.length}
            </Text>
          </HStack>
          <VStack m={4}>
            <FlatList
              data={coletas}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <ColetaCard
                  onPress={() => handleOpenColetaDetails(item.id.toString())}
                  data={item}
                />
              )}
              ListEmptyComponent={() => (
                <Text color="white" textAlign="center" fontFamily='body' fontSize="md" >
                  Não há coletas disponíveis no momento. {'\n'}
                  Volte mais tarde.
                </Text>
              )}
              showsVerticalScrollIndicator={false}
              pb={20}
            />
          </VStack>
        </VStack>
      }
    </VStack>
  );
};