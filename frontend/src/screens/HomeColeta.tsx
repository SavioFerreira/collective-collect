import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import { HStack, VStack, FlatList, useToast, Text, Heading, View, Pressable } from "native-base";

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
import HistorySvg from '@assets/history-closed.svg';
import PublicCollectSvg from '@assets/private-closed.svg';
import AllCollectSvg from '@assets/public-closed.svg'

enum ccOption {
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

  const helpWasteTypeDescriptioin = "Essas são as opções de filtragem para os diversos tipos de resíduos.\n" +
    "Com eles você pode filtrar por qualquer tipo de coleta disponível.\n\nExemplo: PLASTICO só lista as coletas do tipo plástico"

  const helpListCollect = "Essas são as opções de filtragem para as diferente listas de coletas.\n" +
    "Com eles você pode filtrar as coletas em diferentes propósitos." +
    "\n\nNo ícone de usuário, serão listadas as coletas em que você está cadastrado." + 
    "\n\nNo ícone de usuarios, serão listadas as coletas disponíveis" + 
    "\n\nNo ícone de bloqueio, serão listadas as que estão públicas" + 
    "\n\nE no ícone de histórico, serão listadas as coletas que foram concluídas";

  function handleOpenColetaDetails(collectId: string) {
    navigation.navigate('detalhesColeta', { collectId });
  }


  function collectFilterOption(option: ccOption) {
    let selected = coletas;

    if (option === ccOption.all) {
      selected = coletas.filter(collect => collect.status !== StatusEnum.APROVADO);
    }

    else if (option === ccOption.publicCollect) {
      selected = coletas.filter(collect => collect.teamCollect === true && collect.status !== StatusEnum.APROVADO && collect.status !== StatusEnum.OCORRENDO);
    }

    else if (option === ccOption.userCollect) {
      selected = coletas.filter(collect => collect.collaborators
        .some(users => users.id === user.id) && collect.status !== StatusEnum.EM_ANALISE && collect.status !== StatusEnum.APROVADO);
    }

    else if (option === ccOption.historyCollect) {
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
  }, [typeSelected, applyFilter]);

  useFocusEffect(
    useCallback(() => {
      fetchColetas();
    }, [])
  );

  return (
    <VStack flex={1}>
      <IconHeader title="Coletas" />

      <HStack px={1} py={1} mr={3} ml={3} mt={2} bgColor="blue.400" rounded="lg" justifyContent="space-evenly">
        <HStack  justifyContent="space-evenly" flex={1}>
          <Pressable p={2} px={3} isPressed={option === ccOption.userCollect} _pressed={{rounded: 9, bgColor: 'blue.300'}}
            onPress={() => setOption(ccOption.userCollect)}>
            <AvatarSvg width={40} height={40} style={{ marginTop: 6 }} />
          </Pressable>

          <Pressable p={2} isPressed={option === ccOption.all} _pressed={{rounded: 9, bgColor: 'blue.300'}}
            onPress={() => setOption(ccOption.all)}>
            <AllCollectSvg width={50} height={50} />
          </Pressable>

          <Pressable p={2} isPressed={option === ccOption.publicCollect} _pressed={{rounded: 9, bgColor: 'blue.300'}}
            onPress={() => setOption(ccOption.publicCollect)}>
            <PublicCollectSvg width={50} height={50} />
          </Pressable>

          <Pressable p={2} isPressed={option === ccOption.historyCollect} _pressed={{rounded: 9, bgColor: 'blue.300'}}
            onPress={() => setOption(ccOption.historyCollect)}
          >
            <HistorySvg width={50} height={50} />
          </Pressable>
        </HStack>
        <HelpModal label='Ajuda Filtro - Coletas' description={helpListCollect} mr={2}/>
      </HStack>



      {isLoading ? <Loading /> :
        <View flex={1}>
          <VStack mr={3} ml={3} mt={2} flex={1} rounded="lg" bgColor="blue.400" mb={2}>
            <HStack m={2} mb={1} justifyContent="space-evenly">
              <View m={4} />
              <Heading color="white" fontSize="xl" fontFamily="heading" alignSelf="center">
                Coletas Disponíveis
              </Heading>
              <Text color="white" fontSize="xl" fontFamily="heading" alignSelf="flex-end">
                {collectFilterOption(option).length}
              </Text>
            </HStack>

            <VStack px={5} mr={2} ml={2} mb={3} bgColor="blue.300" rounded="lg">
              <HStack justifyContent="space-between" m={1} mb={0}>
                <View m={4} />
                <Heading color="darkBlue.700" fontSize="lg" fontFamily="heading">
                  Tipos de resíduo
                </Heading>
                <HelpModal label='Ajuda Filtro - Resíduos' description={helpWasteTypeDescriptioin}/>
              </HStack>
              <FlatList
                data={types}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <Group mb={1}
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

            <VStack mr={2} ml={2} flex={1}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={fetchColetas}
                  />
                }
                data={
                  collectFilterOption(option)
                }
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
