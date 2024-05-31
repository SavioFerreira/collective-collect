import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, Icon, View, Pressable} from "native-base";
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
import { StatusEnum } from '@enums/StatusEnum';

export function HomeColeta() {

  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState(Object.values(ResiduoType));
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const [allColetas, setAllColetas] = useState<ColetaDTO[]>([]);
  const { user } = useAuth();

  const userCollects = coletas.filter(collect => collect.collaborators.some(users => users.id === user.id)).filter(collect => (collect.status !== StatusEnum.EM_ANALISE) && (collect.status !== StatusEnum.APROVADO));
  const visibleCollect = coletas.filter(collect => collect.status !== StatusEnum.APROVADO);
  const [isUserCollectVisible, setIsUserCollectVisible] = useState(false);
  const [userCollectHeight, setUserCollectHeight] = useState(50);

  const PublicCollects = coletas.filter(collect => collect.teamCollect === true && collect.status === StatusEnum.DISPONIVEL);
  const [publicCollectHeight, setPublicCollectHeight] = useState(50);
  const [isPublicCollectVisible, setIsPublicCollectVisible] = useState(false);

  const [typeSelected, setTypeSelected] = useState(types[0]);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const helpDescriptioin = "Os filtros são opções de filtragem para os diversos tipos de resíduos.\n" +
    "Com eles você pode filtrar por qualquer tipo de coleta disponível.\nExemplo: PLASTICO só lista as coletas do tipo plástico"


  function toggleUserCollect() {
    setIsUserCollectVisible(!isUserCollectVisible);
    setUserCollectHeight(isUserCollectVisible ? 55 : 450);
  }

  function togglePublicCollect() {
    setIsPublicCollectVisible(!isPublicCollectVisible);
    setPublicCollectHeight(isPublicCollectVisible ? 55 : 450);
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
      <VStack px={2} m={3} mb={2} bgColor="blue.400" rounded="lg">
        <HStack justifyContent="space-between" m={1}>
          <View m={4} />
          <Heading color="darkBlue.700" fontSize="lg" fontFamily="heading" mb={2}>
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
        
          {(!isUserCollectVisible || userCollects.length === 0) && (!isPublicCollectVisible || PublicCollects.length === 0) &&
            <VStack mr={3} ml={3} flex={1} rounded="lg" bgColor="blue.400" mb={2}>
              <HStack m={2} justifyContent="space-evenly">
                <View m={4} />
                <Heading color="white" fontSize="xl" fontFamily="heading" alignSelf="center">
                  Todas as coletas
                </Heading>
                <Text color="white" fontSize="xl" fontFamily="heading" alignSelf="flex-end">
                  {visibleCollect.length}
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
                  data={visibleCollect}
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

          <HStack justifyContent="space-between" mr={2} ml={2} mb={2}>
            {userCollects.length > 0 && !isPublicCollectVisible &&
              <View flex={1} minH={userCollectHeight} maxH={userCollectHeight} m={1}>
                <VStack flex={1} bgColor="blue.400" borderWidth={1} borderColor="red.500" rounded="lg">
                  <HStack justifyContent="space-evenly" m={2} >
                    <Heading color="white" fontSize="sm" fontFamily="heading">
                      Você possui {userCollects.length}º agendamentos
                    </Heading>
                    <Pressable _pressed={{ opacity: 60 }} onPress={toggleUserCollect}>
                      {isUserCollectVisible ?
                        <Icon alignSelf="center" size={9} color="white"
                          as={Entypo}
                          name="chevron-small-up"
                        />
                        :
                        <Icon alignSelf="center" size={9} color="white"
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
                        data={userCollects}
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

            {PublicCollects.length > 0 && !isUserCollectVisible &&
              <View flex={1} minH={publicCollectHeight} maxH={publicCollectHeight} m={1}>
                <VStack flex={1}  bgColor="blue.400" borderWidth={1} borderColor="green.600" rounded="lg">
                  <HStack justifyContent="space-evenly" m={2}>
                    <Heading color="white" fontSize="sm" fontFamily="heading">
                      Existem {PublicCollects.length}º coletas públicas
                    </Heading>
                    <Pressable _pressed={{ opacity: 60 }} onPress={togglePublicCollect}>
                      {isPublicCollectVisible ?
                        <Icon alignSelf="center" size={9} color="white"
                          as={Entypo}
                          name="chevron-small-up"
                        />
                        :
                        <Icon alignSelf="center" size={9} color="white"
                          as={Entypo}
                          name="chevron-small-down"
                        />
                      }
                    </Pressable>
                  </HStack>
                  <VStack mr={2} ml={2} flex={1}>
                    {isPublicCollectVisible &&
                      <FlatList
                        refreshControl={
                          <RefreshControl
                            refreshing={isLoading}
                            onRefresh={fetchColetas}
                          />
                        }
                        data={PublicCollects}
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
          </HStack>

        </View>
      }
    </VStack>
  );

};
