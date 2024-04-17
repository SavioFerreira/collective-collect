import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, Center, Icon } from "native-base";
import { IconHeader } from "@components/IconHeader";

import { Entypo } from '@expo/vector-icons';

import { ColetaDTO } from '@dtos/ColetaDTO';
import { api } from '@services/api'

import { Group } from '@components/Group';
import { AppError } from '@utils/AppError';
import { ColetaCard } from '@components/ColetaCard';
import { useFocusEffect } from '@react-navigation/native';
import { Loading } from '@components/Loading';

export function HomeColeta() {
  const [isLoading, setIsLoading] = useState(true);
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const [groups, setGroups] = useState<string[]>(['OUTROS', 'PlÁSTICO', 'METAL', 'ALVENARIA', 'ORGÂNICO']);
  const [groupSelected, setGroupSelected] = useState('OUTROS');
  const toast = useToast();

  async function fetchColetas() {
    try {
      setIsLoading(true);
      const response = await api.get('/collects');
      setColetas(response.data);
      //setGroups(response.data);
      fetchColetas();

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar as coletas. Tente novamente mais tarde.';
      toast.show({
        description: title
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchColetas();
  }, []);

  useFocusEffect(
    useCallback(() => {

    }, [groupSelected])
  )


  return (
    <VStack flex={1} >
      <IconHeader title="Coletas" />

      <VStack px={2} py={2} backgroundColor={'blue.400'} m={4} borderRadius="lg">
        <HStack justifyContent="space-between">
          <Heading color="darkBlue.600" fontSize="xl" fontFamily="heading" mb={2} ml={'24'}>
            Tipos de resíduos
          </Heading>
          <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
            <Icon
              as={Entypo}
              name="help-with-circle"
              color="purple.700"
              size={7}
            />
          </TouchableOpacity>
        </HStack>
        <FlatList
          data={groups}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Group
              name={item}
              isActive={groupSelected === item}
              onPress={() => setGroupSelected(item)}
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
        <VStack flex={1} px={1} backgroundColor={'blue.400'} m={4} borderRadius="lg">
          <HStack justifyContent="space-between" m={5}>
            <Heading color="darkBlue.600" fontSize="lg" fontFamily="heading">
              Coletas disponíveis
            </Heading>
            <Text color="darkBlue.600" fontSize="lg" fontFamily="heading">
              {coletas.length}
            </Text>
          </HStack>
          <FlatList
            data={coletas}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ColetaCard
                onPress={() => { console.log(item.id) }}
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            pb={20}
          />
        </VStack>
      }
    </VStack>
  );
};