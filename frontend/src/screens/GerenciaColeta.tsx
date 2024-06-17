import { ColetaAdminCard } from '@components/ColetaAdminCard';
import { IconHeader } from '@components/IconHeader';
import { Loading } from '@components/Loading';
import { ColetaDTO } from '@dtos/ColetaDTO';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { FlatList, VStack, View, Text, useToast, Heading, HStack, Icon, Pressable, Image, ScrollView, Center, Box } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { Feather, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import MapBackgroundImg from '@assets/mapBackGround.png'
import { ResiduoType } from '@enums/ResiduoTypesEnum';
import { Group } from '@components/Group';


export function GerenciaColeta() {
  const [isLoading, setIsLoading] = useState(true);
  const [collect, setCollect] = useState<ColetaDTO[]>([]);
  const [allCollect, setAllCollect] = useState<ColetaDTO[]>([]);
  const [selectedItem, setSelectedItem] = useState<ColetaDTO | null>(null);
  const [types, setTypes] = useState(Object.values(ResiduoType));
  const [typeSelected, setTypeSelected] = useState(types[0]);
  const toast = useToast();
  
  const applyFilter = useCallback(() => {
    const filteredColetas = typeSelected === ResiduoType.TODOS ? allCollect : allCollect.filter(coleta => coleta.type === typeSelected);
    setCollect(filteredColetas);
  }, [typeSelected, allCollect]);

  const handleTypeSelected = useCallback((item: ResiduoType) => {
    setTypeSelected(item);
  }, []);

  async function fetchDenuncias() {
    setIsLoading(true);
    try {
      const { data } = await api.get('api/collect');
      setAllCollect(data);
    } catch (error) {
      const isAppError = error instanceof AppError; const title = isAppError ? error.message : 'Não foi possível carregar os detalhes da denúncia';
      toast.show({ title: title, placement: 'top', bgColor: 'red.500' })
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    applyFilter();
  }, [typeSelected, applyFilter]);

  useFocusEffect(
    useCallback(() => {
      fetchDenuncias();
    }, [])
  );

  return (
    <VStack flex={1}>
      <IconHeader title="Gerenciamento de Coletas" />
      <VStack px={1} mr={3} ml={3} mb={1} mt={1} bgColor="blue.400" rounded="lg">
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
          _contentContainerStyle={{ px: 2 }}
          my={16}
          maxH={16}
          mb={1} mt={1}
        />
      </VStack>

      {isLoading ? <Loading /> :
        <View flex={1} m={3} mt={0} mb={1}>
          <VStack flex={1} rounded="lg" bgColor="blue.400">
            <VStack mr={2} ml={2} flex={1}>
              <FlatList
                mt={1}
                mb={1}
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={fetchDenuncias}
                  />
                }
                data={collect}
                keyExtractor={item => item.id?.toString() ?? ''}
                renderItem={({ item }) => (
                  <ColetaAdminCard
                    data={item}
                    activeOpacity={0.7}
                    onPress={() => setSelectedItem(item)}
                  />
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

      <VStack h="57%" minH="57%" maxH="57%" bgColor="blue.400" rounded="lg" m={3} mt={0} mb={1} p={2}>
        <ScrollView>
          <Center mb={1} bgColor="darkBlue.800" rounded="lg" borderBottomRadius={0}>
            <Text color="emerald.400" fontSize="md">
              {selectedItem ? selectedItem.title : 'Título'}
            </Text>
          </Center>
          <VStack bgColor="darkBlue.800" mb={1}>
            <Text color="emerald.400" fontFamily="body" m={1} fontSize="sm" textAlign="center" numberOfLines={3}>
              {selectedItem ? selectedItem.description : 'Descrição'}
            </Text>
          </VStack>
          <HStack justifyContent="center" bgColor="darkBlue.800" mb={1}>
            <Text m={1} color="emerald.400" fontFamily="body" fontSize="sm">
              TIPO: {selectedItem ? selectedItem.type : ''}
            </Text>
          </HStack>
          {(selectedItem ? selectedItem.complaintImage : '') ?
            <Box w="full" h={56} position="relative" mb={1}>
              <Image
                alt="imagem da coleta"
                source={{ uri: `${selectedItem ? selectedItem.complaintImage : ''}` }}
                w="full"
                h={56}
                resizeMode="cover"
                borderWidth={2}
                borderColor="darkBlue.800"
              />
              <Box position="absolute" bottom={0} left={0} p={1} bgColor="rgba(7, 22, 51, 0.4)" w="full">
                <HStack alignItems="center">
                  <Icon
                    as={FontAwesome6}
                    name={"map-location-dot"}
                    color="emerald.500"
                    size={8}
                    mr={2}
                    ml={2}
                  />
                  <Text color="emerald.400" fontStyle="italic" ml={2} numberOfLines={2} maxW={'80%'}>
                    Endereço: {selectedItem ? selectedItem.locale.address : ''}
                  </Text>
                </HStack>
              </Box>
            </Box>
            :
            <Image
              alt="imagem da coleta"
              source={MapBackgroundImg}
              w="full"
              h={56}
              resizeMode="cover"
              borderWidth={2}
              borderColor="darkBlue.800"
            />
          }
          <HStack justifyContent="space-evenly" bgColor="darkBlue.800" mt={1}>
            <Text m={1} color="emerald.400" fontFamily="body" fontSize="sm">
              STATUS: {selectedItem ? selectedItem.status : ''}
            </Text>
            <Text m={1} color="emerald.400" fontFamily="body" fontSize="sm">
              GRAVIDADE: {selectedItem ? selectedItem.gravity : ''}
            </Text>
          </HStack>

          <HStack px={1} py={1} mt={1} bgColor="darkBlue.800" rounded="lg" borderTopRadius={0} justifyContent="space-evenly">
            <HStack justifyContent="space-evenly" flex={1}>
              <Pressable _pressed={{ opacity: 50 }}
                onPress={() => { }} alignSelf="center">
                <Icon
                  as={Feather}
                  name={'edit'}
                  color="yellow.400"
                  size={7}
                  alignSelf="center"
                />
                <Text color="yellow.400" fontFamily="body" fontSize="sm">Editar</Text>
              </Pressable>

              <Pressable _pressed={{ opacity: 50 }}
                onPress={() => { }} alignSelf="center">
                <Icon
                  as={MaterialIcons}
                  name={'delete-forever'}
                  color="danger.700"
                  size={7}
                  alignSelf="center"
                />
                <Text color="danger.700" fontFamily="body" fontSize="sm">Deletar</Text>
              </Pressable>

              <Pressable _pressed={{ opacity: 50 }}
                onPress={() => { }} alignSelf="center">
                <Icon
                  as={MaterialIcons}
                  name={'cancel'}
                  color="blue.400"
                  size={7}
                  alignSelf="center"
                />
                <Text color="blue.400" fontFamily="body" fontSize="sm">Cancelar</Text>
              </Pressable>

              <Pressable _pressed={{ opacity: 50 }}
                onPress={() => { }} alignSelf="center">
                <Icon
                  as={FontAwesome6}
                  name={'save'}
                  color="green.400"
                  size={7}
                  alignSelf="center"
                />
                <Text color="green.400" fontFamily="body" fontSize="sm">Salvar</Text>
              </Pressable>

            </HStack>
          </HStack>

        </ScrollView>
      </VStack>
    </VStack >
  );
}