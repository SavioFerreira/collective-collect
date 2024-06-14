import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, View } from "native-base";

import { IconHeader } from "@components/IconHeader";
import { Loading } from '@components/Loading';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';

import { useAuth } from '@hooks/useAuth';
import { ColetaAdminCard } from '@components/ColetaAdminCard';
import { DenunciaDTO } from '@dtos/DenunciaDTO';

export function GerenciaColeta() {
  const [isLoading, setIsLoading] = useState(true);
  const [complaint, setComplaint] = useState<DenunciaDTO[]>([]);
  const video = React.useRef(null);

  const { user } = useAuth();

  const toast = useToast();

  async function fetchDenuncias() {
    setIsLoading(true);
    try {
      const { data } = await api.get('api/complaint');
      setComplaint(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes da denúncia';
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
      fetchDenuncias();
    }, [])
  );

  return (
    <VStack flex={1}>
      <IconHeader title="Gerenciamento de Coletas" />
      {isLoading ? <Loading /> :
        <View flex={1} m={3}>
          <VStack flex={1} rounded="lg" bgColor="blue.400">
            <VStack mr={2} ml={2} flex={1}>
              <FlatList
              mt={2}
              mb={2}
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={fetchDenuncias}
                  />
                }
                data={complaint}
                keyExtractor={item => item.id?.toString() ?? ''}
                renderItem={({ item }) => (
                  <ColetaAdminCard data={item} onPress={ () => {}}/>
                )}
                ListEmptyComponent={() => (
                  <Text color="white" textAlign="center" fontFamily='body' fontSize="md" >
                    Não há denúncias para análise no momento. {'\n'}Volte mais tarde.
                  </Text>
                )}
                showsVerticalScrollIndicator={false}
              />
            </VStack>
          </VStack>
        </View>
      }
    </VStack >
  );

};
