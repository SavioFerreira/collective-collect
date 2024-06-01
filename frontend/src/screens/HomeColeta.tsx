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
  
  import AvatarSvg from '@assets/avatar.svg';
  import HistoryClosedSvg from '@assets/history-closed.svg';
  import PublicCollectClosedSvg from '@assets/public-closed.svg';

export function HomeColeta() {

  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState(Object.values(ResiduoType));
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const [allColetas, setAllColetas] = useState<ColetaDTO[]>([]);
  const [typeSelected, setTypeSelected] = useState(types[0]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();
  const toast = useToast();

  const [publicCollectHeight, setPublicCollectHeight] = useState(50);
  const [isPublicCollectVisible, setIsPublicCollectVisible] = useState(false);
  const [isUserCollectVisible, setIsUserCollectVisible] = useState(false);
  const [userCollectHeight, setUserCollectHeight] = useState(50);
  
  const [userFilter, setUserFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const userCollects = coletas.filter(collect => collect.collaborators.some(users => users.id === user.id)).filter(collect => (collect.status !== StatusEnum.EM_ANALISE) && (collect.status !== StatusEnum.APROVADO));
  const visibleCollect = coletas.filter(collect => collect.status !== StatusEnum.APROVADO);
  const PublicCollects = coletas.filter(collect => collect.teamCollect === true && collect.status === StatusEnum.DISPONIVEL);

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
    let filteredCollect = allColetas;
  
    if (typeSelected !== ResiduoType.TODOS) {
      filteredCollect = filteredCollect.filter(coleta => coleta.type === typeSelected);
    }
  
    if (userFilter) {
      filteredCollect = filteredCollect.filter(collect => 
        collect.collaborators.some(user => user.id === user.id) &&
        collect.status !== StatusEnum.EM_ANALISE &&
        collect.status !== StatusEnum.APROVADO
      );
    }
  
    if (statusFilter === 'visible') {
      filteredCollect = filteredCollect.filter(collect => collect.status !== StatusEnum.APROVADO);
    } else if (statusFilter === 'public') {
      filteredCollect = filteredCollect.filter(collect => 
        collect.teamCollect === true && collect.status === StatusEnum.DISPONIVEL
      );
    }
    
      setColetas(filteredCollect);
  }, [typeSelected, allColetas, userFilter, statusFilter]);
  
  const handleTypeSelected = useCallback((item: ResiduoType) => {
    setTypeSelected(item);
  }, []);
  
  const handleUserFilterChange = useCallback(() => {
    setUserFilter(!userFilter);
  }, [userFilter]);
  
  const handleStatusFilterChange = useCallback((filterType: string) => {
    setStatusFilter(filterType);
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
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    applyFilter();
  }, [typeSelected, applyFilter, userFilter, statusFilter]);
  
  useFocusEffect(
    useCallback(() => {
      fetchColetas();
    }, []) 
  );

  return (
    <VStack flex={1}>
      <IconHeader title="Coletas" />

      <HStack px={2} py={2} mr={3} ml={3} mt={1} bgColor="blue.400" rounded="lg" justifyContent="space-evenly">

        <PublicCollectClosedSvg width={50} height={50} onPress={() => handleStatusFilterChange}/>

        <AvatarSvg width={40} height={40} onPress={() => handleUserFilterChange}/>

        <HistoryClosedSvg width={50} height={50} onPress={() => {}}/>

      </HStack>

      <VStack px={2} m={3} mt={1} mb={1} bgColor="blue.400" rounded="lg">
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
        
          {/* {(!isUserCollectVisible || userCollects.length === 0) && (!isPublicCollectVisible || PublicCollects.length === 0) && */}
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
          {/* } */}


          {/* <HStack justifyContent="space-between" mr={2} ml={2} mb={2}>
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
          </HStack> */}

        </View>
      }
    </VStack>
  );

};
