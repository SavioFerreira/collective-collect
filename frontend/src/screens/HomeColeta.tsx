import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, View, Pressable} from "native-base";

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
import PublicCollectClosedSvg from '@assets/private-closed.svg';
import AllCollectSvg from '@assets/public-closed.svg'

enum ccOption  {
  'publicCollect',
  'userCollect',
  'historyCollect',
  'all'
}

export function HomeColeta() {
  const [isLoading, setIsLoading] = useState(true);

  const [types, setTypes] = useState(Object.values(ResiduoType));
  const [coletas, setColetas] = useState<ColetaDTO[]>([]);
  const [allColetas, setAllColetas] = useState<ColetaDTO[]>([]);
  const [typeSelected, setTypeSelected] = useState(types[0]);
  const [option, setOption] = useState<number>(3);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();
  const toast = useToast();

  const helpDescriptioin = "Os filtros são opções de filtragem para os diversos tipos de resíduos.\n" +
    "Com eles você pode filtrar por qualquer tipo de coleta disponível.\nExemplo: PLASTICO só lista as coletas do tipo plástico"

    function handleOpenColetaDetails(collectId: string) {
      navigation.navigate('detalhesColeta', { collectId });
    }


  function collectFilterOption(option: ccOption) {
    let selected = coletas;

    if (option === ccOption.all){
      selected = coletas.filter(collect => collect.status !== StatusEnum.APROVADO);
    }

    if (option === ccOption.publicCollect){
      selected = coletas.filter(collect => collect.teamCollect === true && collect.status === StatusEnum.DISPONIVEL);
    }

    if (option === ccOption.userCollect) {
      selected = coletas.filter(collect => collect.collaborators
        .some(users => users.id === user.id) && collect.status !== StatusEnum.EM_ANALISE && collect.status !== StatusEnum.APROVADO);
    }

    if (option === ccOption.historyCollect) {
      selected = coletas.filter(collect => collect.status === StatusEnum.APROVADO)
    }

    return selected;
  }

  const handleTypeSelected = useCallback((item: ResiduoType) => {
    setTypeSelected(item);
  }, []);

  const applyFilter = useCallback(() => {
    const filteredColetas = typeSelected === ResiduoType.TODOS ? allColetas : allColetas.filter(coleta => coleta.type === typeSelected);
    setColetas(filteredColetas);
  }, [typeSelected, allColetas]);


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
  }, [typeSelected, applyFilter ]);

  useFocusEffect(
    useCallback(() => {
      fetchColetas();
    }, [])
  );

  return (
    <VStack flex={1}>
      <IconHeader title="Coletas" />

      <HStack px={2} py={2} mr={3} ml={3} mt={1} bgColor="blue.400" rounded="lg" justifyContent="space-evenly">

        <Pressable _pressed={{opacity: 60}}
          onPress={() => setOption(ccOption.userCollect)}>
          <AvatarSvg width={40} height={40} style={{marginTop: 6}}/>
        </Pressable>

        <Pressable _pressed={{opacity: 60}} 
          onPress={() => setOption(ccOption.all)}>
            <AllCollectSvg width={50} height={50}/>
        </Pressable>

        <Pressable _pressed={{opacity: 60}} 
          onPress={() => setOption(ccOption.publicCollect)}>
          <PublicCollectClosedSvg width={50} height={50}/>
        </Pressable>


        <Pressable _pressed={{opacity: 60}}
          onPress={() => setOption(ccOption.historyCollect)}
        >
          <HistoryClosedSvg width={50} height={50}/>
        </Pressable>
      </HStack>

      <VStack px={2} mr={3} ml={3} mt={1} mb={1} bgColor="blue.400" rounded="lg">
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
          <VStack mr={3} ml={3} flex={1} rounded="lg" bgColor="blue.400" mb={2}>
            <HStack m={2} justifyContent="space-evenly">
              <View m={4} />
              <Heading color="white" fontSize="xl" fontFamily="heading" alignSelf="center">
                Coletas Disponíveis
              </Heading>
              <Text color="white" fontSize="xl" fontFamily="heading" alignSelf="flex-end">
                {collectFilterOption(option).length}
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
                data={collectFilterOption(option)}
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

        </View>
      }
    </VStack>
  );
};
