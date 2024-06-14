import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import { VStack, FlatList, useToast, Text, Heading, View, HStack, Pressable, Icon } from "native-base";

import { IconHeader } from "@components/IconHeader";
import { Loading } from '@components/Loading';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ColetaAdminCard } from '@components/ColetaAdminCard';
import { ColetaDTO } from '@dtos/ColetaDTO';

export function GerenciaColeta() {
  const [isLoading, setIsLoading] = useState(true);
  const [complaint, setComplaint] = useState<ColetaDTO[]>([]);
  const toast = useToast();

  async function fetchDenuncias() {
    setIsLoading(true);
    try {
      const { data } = await api.get('api/collect');
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
        <View flex={1} m={3} mt={2} mb={2}>
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
                  <ColetaAdminCard data={item} onPress={() => { }} />
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
      <VStack h="65%" bgColor="blue.400" rounded="lg" m={3} mt={0} mb={2}>
        <Heading mt={2} textAlign="center" color="green.700" borderWidth={1}>
          descrição
        </Heading>
        <VStack borderWidth={1}>
          <Text ml={2}>
            Autor
          </Text>
        </VStack>

        <HStack borderWidth={1} justifyContent="center">
          <Text borderWidth={1} m={1}>
            tipo
          </Text>
          <Text borderWidth={1} m={1}>
            status
          </Text>
          <Text borderWidth={1} m={1}>
            gravidade
          </Text>
        </HStack>
        <VStack>
          <Text borderWidth={1} h={56} textAlign="center">
            imagem
          </Text>
        </VStack>
        <HStack px={1} py={1} mt={2} bgColor="blue.400" rounded="lg" justifyContent="space-evenly" borderWidth={1}>
          <HStack justifyContent="space-evenly" flex={1}>
            <Pressable  p={2}  _pressed={{ rounded: 9, bgColor: 'blue.300' }}
              onPress={() => {}}>
              <Icon alignSelf="center" />
              <Text>Editar</Text>
            </Pressable>

            <Pressable p={2}  _pressed={{ rounded: 9, bgColor: 'blue.300' }}
              onPress={() => {}}>
              <Icon alignSelf="center" />
              <Text>Deletar</Text>
            </Pressable>
          </HStack>
        </HStack>

      </VStack>
    </VStack >
  );

};
