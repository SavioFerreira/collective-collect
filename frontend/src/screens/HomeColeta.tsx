import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, Center, Icon } from "native-base";

import { Entypo } from '@expo/vector-icons';

import { AppError } from '@utils/AppError';

import { ColetaDTO } from '@dtos/ColetaDTO';
import { api } from '@services/api'

import { IconHeader } from "@components/IconHeader";
import { Group } from '@components/Group';
import { ColetaCard } from '@components/ColetaCard';
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
      const response = await api.get('api/collect');
      setColetas(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar as coletas';
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchColetas();
       const intervalId = setInterval(fetchColetas, 10000); 
       return () => clearInterval(intervalId);
    }, [groupSelected])
  );

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
      }
    </VStack>
  );
};