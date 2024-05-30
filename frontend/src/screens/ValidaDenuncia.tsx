import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, View } from "native-base";

import { IconHeader } from "@components/IconHeader";
import { ColetaCard } from '@components/ColetaCard';
import { Loading } from '@components/Loading';;
import { ColetaDTO } from '@dtos/ColetaDTO';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { StatusEnum } from '@enums/StatusEnum';

export function ValidaDenuncia() {

  const [isLoading, setIsLoading] = useState(true);
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const { user } = useAuth();

  const pendingVerifyComplaint = coletas.filter(collect => collect.status === StatusEnum.PENDENTE);
  const toast = useToast();

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
      <IconHeader title="Validação de Denuncias" />
      {isLoading ? <Loading /> :
        <View flex={1} m={3}>
          <VStack flex={1} rounded="lg" bgColor="blue.400">
            <HStack m={2} justifyContent="space-evenly">
              <View m={4} />
              <Heading color="white" fontSize="xl" fontFamily="heading" alignSelf="center">
                Verificações Pendentes
              </Heading>
              <Text color="white" fontSize="xl" fontFamily="heading" alignSelf="flex-end">
                {pendingVerifyComplaint.length}
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
                data={pendingVerifyComplaint}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <ColetaCard onPress={() => {}} data={item} />
                )}
                ListEmptyComponent={() => (
                  <Text color="white" textAlign="center" fontFamily='body' fontSize="md" >
                    Não há coletas disponíveis no momento. {'\n'}Volte mais tarde.
                  </Text>
                )}
                showsVerticalScrollIndicator={false}
              />
            </VStack>
          </VStack>
          <HStack mt={3} flex={1} rounded="lg" bgColor="blue.400" justifyContent="space-around">
            
          </HStack>
        </View>
      }
    </VStack>
  );

};
