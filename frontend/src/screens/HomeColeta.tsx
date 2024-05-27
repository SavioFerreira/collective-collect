import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, Icon, View, Pressable } from "native-base";
import { Entypo } from '@expo/vector-icons';

import { IconHeader } from "@components/IconHeader";
import { Group } from '@components/Group';
import { ColetaCard } from '@components/ColetaCard';
import { Loading } from '@components/Loading';
import { ResiduoType } from 'src/enums/ResiduoTypesEnum';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ColetaDTO } from '@dtos/ColetaDTO';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { HelpModal } from '@components/HelpModal';
import { useAuth } from '@hooks/useAuth';

export function HomeColeta() {

  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState(Object.values(ResiduoType));
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const [allColetas, setAllColetas] = useState<ColetaDTO[]>([]);
  const [isUserCollectVisible, setIsUserCollectVisible] = useState(false);
  const { user } = useAuth();
  const userCollect = coletas.filter(collect => collect.collaborators.some(users => users.id === user.id));
  const [userCollectHeight, setUserCollectHeight] = useState(50);

  const [typeSelected, setTypeSelected] = useState(types[0]);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const helpDescriptioin = "Os filtros são opções de filtragem para os diversos tipos de resíduos.\n" +
    "Com eles você pode filtrar por qualquer tipo de coleta disponível.\nExemplo: PLASTICO só lista as coletas do tipo plástico"


  function toggleUserCollect() {
    setIsUserCollectVisible(!isUserCollectVisible);
    setUserCollectHeight(isUserCollectVisible ? 50 : 600);
  }

  function handleOpenColetaDetails(collectId: string) {
    navigation.navigate('detalhesColeta', { collectId });
  }

  const applyFilter = useCallback(() => {
    const filteredColetas = typeSelected === ResiduoType.TODOS ? allColetas : allColetas.filter(coleta => coleta.type === typeSelected);
    setColetas(filteredColetas);
  }, [typeSelected, allColetas]);

  const handleTypeSelected = useCallback((item: ResiduoType) => {
    setTypeSelected(item);
  }, []);

  async function fetchColetas() {
    setIsLoading(true);
    try {
      const { data } = await api.get('api/collect');
      setAllColetas(data);
      applyFilter();
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

  useEffect(() => {
    applyFilter();
  }, [typeSelected, applyFilter]);

  useFocusEffect(
    useCallback(() => {
      fetchColetas();
    }, [])
  );


  return (
    <VStack flex={1}>
      <IconHeader title="Coletas" />
      <VStack px={2} m={2} bgColor="blue.400" rounded="lg">
        <HStack justifyContent="space-between">
          <Heading color="darkBlue.700" fontSize="xl" fontFamily="heading" mb={2} ml={'24'}>
            Tipos de resíduo
          </Heading>
          <HelpModal label='Ajuda Filtro - Coletas' description={helpDescriptioin} />
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
          _contentContainerStyle={{ px: 5 }}
          my={16}
          maxH={16}
          mb={1} mt={1}
        />
      </VStack>
      {isLoading ? <Loading /> :
        <View flex={1}>
          {userCollect.length > 0 &&
            <View mr={2} ml={2} mb={2} flex={1} minH={userCollectHeight} maxH={userCollectHeight}>
                <VStack flex={1} bgColor={'blue.400'} rounded="lg">
                  <HStack justifyContent="space-between" m={4} >
                    <Heading color="darkBlue.700" fontSize="lg" fontFamily="heading">
                      Você tem {userCollect.length}º agendamentos
                    </Heading>
                    <Pressable _pressed={{ opacity: 60 }} onPress={toggleUserCollect}>
                      {isUserCollectVisible ?
                        <Icon alignSelf="center" size={9} color="darkBlue.700"
                          as={Entypo}
                          name="chevron-small-up"
                        />
                        :
                        <Icon alignSelf="center" size={9} color="darkBlue.700"
                          as={Entypo}
                          name="chevron-small-down"
                        />
                      }
                    </Pressable>
                  </HStack>
                  <VStack mr={2} ml={2} flex={1}>
                    {isUserCollectVisible &&
                      <FlatList
                        refreshControl={
                          <RefreshControl
                            refreshing={isLoading}
                            onRefresh={fetchColetas}
                          />
                        }
                        data={userCollect}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                          <ColetaCard onPress={() => handleOpenColetaDetails(item.id.toString())} data={item} />
                        )}
                        ListEmptyComponent={() => (
                          <Text color="white" textAlign="center" fontFamily='body' fontSize="md" >
                            Não há coletas disponíveis no momento. {'\n'}Volte mais tarde.
                          </Text>
                        )}
                        showsVerticalScrollIndicator={false}
                      />
                    }
                  </VStack>
                </VStack>
            </View>

          }
          {!isUserCollectVisible &&
            <VStack mr={2} ml={2} flex={1} bgColor="blue.400" rounded="lg" mb={2}>
              <HStack justifyContent="space-between" m={4}>
                <Heading color="darkBlue.700" fontSize="lg" fontFamily="heading">
                  Coletas disponíveis
                </Heading>
                <Text color="darkBlue.700" fontSize="lg" fontFamily="heading">
                  {coletas.filter(collect => collect.teamCollect === true).length}
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
                  data={coletas.filter(collect => collect.teamCollect === true)}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <ColetaCard onPress={() => handleOpenColetaDetails(item.id.toString())} data={item} />
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
          }
        </View>
      }
    </VStack>
  );

};
