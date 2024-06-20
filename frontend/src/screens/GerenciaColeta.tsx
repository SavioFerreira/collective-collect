import { ColetaAdminCard } from '@components/ColetaAdminCard';
import { IconHeader } from '@components/IconHeader';
import { Loading } from '@components/Loading';
import { ColetaDTO } from '@dtos/ColetaDTO';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { FlatList, VStack, View, Text, useToast, HStack, Icon, Pressable, Image, ScrollView, Center, Box, Input, Select, CheckIcon, useTheme } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl } from 'react-native';
import { Feather, MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons';
import MapBackgroundImg from '@assets/mapBackGround.png'
import { ResiduoType } from '@enums/ResiduoTypesEnum';
import { Group } from '@components/Group';
import { ResiduoGravity } from '@enums/ResiduoGravityEnum';
import { StatusEnum } from '@enums/StatusEnum';


export function GerenciaColeta() {
  const [isLoading, setIsLoading] = useState(true);
  const [collect, setCollect] = useState<ColetaDTO[]>([]);
  const [allCollect, setAllCollect] = useState<ColetaDTO[]>([]);
  const [selectedItem, setSelectedItem] = useState<ColetaDTO | null>(null);
  const types = Object.values(ResiduoType);
  const [typeSelected, setTypeSelected] = useState(types[0]);

  const [wasteType, setWasteType] = useState<ResiduoType | undefined>();
  const [gravityType, setGravityType] = useState<ResiduoGravity | undefined>();
  const [statusType, setStatusType] = useState<StatusEnum | undefined>();
  const [collectTitle, setCollectTitle] = useState<string>();
  const [collectDescription, setCollectDescription] = useState<string>();
  const [collectAddress, setCollectAddress] = useState<string>();

  const [isEditing, setIsEditing] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingType, setIsEditingType] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingGravity, setIsEditingGravity] = useState(false);

  const { colors } = useTheme();
  const toast = useToast();

  function handleWasteTypeChange(itemValue: string) {
    setWasteType(itemValue as ResiduoType);
  }

  function handleGravityTypeChange(itemValue: string) {
    setGravityType(itemValue as ResiduoGravity);
  }

  function handleStatusTypeChange(itemValue: string) {
    setStatusType(itemValue as StatusEnum);
  }

  function toggleEdit() {
    setIsEditing(!isEditing);
  }

  function clearField() {

    setSelectedItem(null);
    setCollectTitle(undefined);
    setCollectDescription(undefined);
    setCollectAddress(undefined);
    setWasteType(undefined);
    setGravityType(undefined)
    setStatusType(undefined);

    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setIsEditingAddress(false);
    setIsEditingType(false);
    setIsEditingGravity(false);
    setIsEditingStatus(false);

  }

  const applyFilter = useCallback(() => {
    const filteredColetas = typeSelected === ResiduoType.TODOS ? allCollect : allCollect.filter(coleta => coleta.type === typeSelected);
    setCollect(filteredColetas);
  }, [typeSelected, allCollect]);

  const handleTypeSelected = useCallback((item: ResiduoType) => {
    setTypeSelected(item);
  }, []);

  async function handleDeleteComplaintAndCollect() {
    setIsLoading(true);
    const id = selectedItem?.complaintId;
    if (id !== undefined) {
      try {
        await api.delete(`api/complaint/${id}`);
        fetchCollect();
      } catch (error) {
        const isAppError = error instanceof AppError; const title = isAppError ? error.message : 'Não foi possível deletar essa coleta';
        toast.show({ title: title, placement: 'top', bgColor: 'red.500' })
      }
      finally {
        setIsLoading(false);
      }
    }
  }

  async function handleEditCollect() {

    const editedData = {
      title: collectTitle?.length !== undefined && collectTitle?.length > 1  ? collectTitle : selectedItem?.title,
      description: collectDescription?.length !== undefined && collectDescription?.length > 1 ? collectDescription : selectedItem?.description,
      wasteType: wasteType ?? selectedItem?.type,
      addrees: collectAddress?.length !== undefined && collectAddress?.length > 1 ? collectAddress : selectedItem?.locale.address,
      status: statusType ?? selectedItem?.status,
      gravity: gravityType ?? selectedItem?.gravity,
    }

    setIsLoading(true);
    const id = selectedItem?.id;
    if (id !== undefined) {
      try {
        const data = await api.patch(`api/collect/${id}`, editedData);
        fetchCollect();
        if(data.status === 200) {
          toggleEdit();
        }
      } catch (error) {
        const isAppError = error instanceof AppError; const title = isAppError ? error.message : 'Não foi possível atualizar essa coleta';
        toast.show({ title: title, placement: 'top', bgColor: 'red.500' })
      }
      finally {
        setIsLoading(false);
      }
    }
  }

  async function fetchCollect() {
    setIsLoading(true);
    try {
      const { data } = await api.get('api/collect');
      setAllCollect(data);
      clearField();
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
      fetchCollect();
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
                    onRefresh={fetchCollect}
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

      <VStack h="60%" minH="60%" maxH="60%" bgColor="blue.400" rounded="lg" m={3} mt={0} mb={1} p={2}>
        <ScrollView>
          <Center mb={1} bgColor="darkBlue.800" rounded="lg" borderBottomRadius={0}>
            {isEditing ?
              <Text color="emerald.400" fontSize="md">
                {selectedItem ? selectedItem.title : 'Título'}
              </Text>
              :
              <HStack>
                <Text color="emerald.400" fontSize="md">
                  {selectedItem ? selectedItem.title : 'Título'}
                </Text>
                <Pressable _pressed={{ opacity: 50 }} onPress={() => { setIsEditingTitle(!isEditingTitle) }} alignSelf="center">
                  <Icon
                    as={MaterialIcons}
                    name={'mode-edit'}
                    color="green.400"
                    size={5}
                    alignSelf="center"
                    ml={3}
                  />
                </Pressable>
              </HStack>
            }
          </Center>
          {!isEditing && isEditingTitle &&
            <Box justifyContent="center" alignItems="center" mb={1} bgColor="darkBlue.700">
              <Input h={6} w="100%" m={1} p={1} borderWidth={0} color="blue.200" fontSize="md" textAlign="center" alignContent="center"
                placeholder={selectedItem ? selectedItem.title : 'Título'}
                placeholderTextColor="green.400"
                onSubmitEditing={() => { }}
                returnKeyType="send"
                onChangeText={setCollectTitle}
              />
            </Box>
          }
          <VStack bgColor="darkBlue.800" mb={1}>
            {isEditing ?
              <Text color="emerald.400" fontFamily="body" m={1} fontSize="sm" textAlign="center" numberOfLines={3}>
                {selectedItem ? selectedItem.description : 'Descrição'}
              </Text>
              :
              <HStack alignSelf="center" m={1}>
                <Text color="emerald.400" fontSize="sm" maxW="80%" numberOfLines={3}>
                  {selectedItem ? selectedItem.description : 'Descrição'}
                </Text>
                <Pressable _pressed={{ opacity: 50 }} onPress={() => { setIsEditingDescription(!isEditingDescription) }} alignSelf="center">
                  <Icon
                    as={MaterialIcons}
                    name={'mode-edit'}
                    color="green.400"
                    size={5}
                    alignSelf="center"
                    ml={3}
                  />
                </Pressable>
              </HStack>
            }
          </VStack>
          {!isEditing && isEditingDescription &&
            <Box justifyContent="center" alignItems="center" mb={1} bgColor="darkBlue.700">
              <Input h={6} w="100%" p={1} m={1} borderWidth={0} color="blue.200" fontSize="md" textAlign="center" alignContent="center"
                placeholder={selectedItem ? selectedItem.description : 'Descrição'}
                placeholderTextColor="green.400"
                onSubmitEditing={() => { }}
                returnKeyType="send"
                onChangeText={setCollectDescription}
                
              />
            </Box>
          }
          <HStack justifyContent="center" bgColor="darkBlue.800" mb={1}>
            {isEditing ?
              <Text m={1} color="emerald.400" fontFamily="body" fontSize="sm">
                TIPO: {selectedItem ? selectedItem.type : 'Tipo'}
              </Text>
              :
              <HStack alignSelf="center" m={1}>
                <Text color="emerald.400" fontSize="sm" maxW="80%" numberOfLines={3}>
                  TIPO: {selectedItem ? selectedItem.type : 'Tipo'}
                </Text>
                <Pressable _pressed={{ opacity: 50 }} onPress={() => { setIsEditingType(!isEditingType) }} alignSelf="center">
                  <Icon
                    as={MaterialIcons}
                    name={'mode-edit'}
                    color="green.400"
                    size={5}
                    alignSelf="center"
                    ml={3}
                  />
                </Pressable>
              </HStack>
            }
          </HStack>
          {!isEditing && isEditingType &&
            <Box w="100%" mb={1}>
              <Select
                selectedValue={wasteType}
                onValueChange={handleWasteTypeChange}
                bgColor="darkBlue.700" fontSize="sm" color="green.400" borderWidth={0}
                h={10} w="100%"
                placeholder="Tipo de Resíduo"
                placeholderTextColor={colors.green[400]}
                dropdownIcon={<Icon as={Ionicons} name="chevron-down" size="7" color="green.400" mr={5} mt={2} />}
                _actionSheetContent={{
                  bg: "darkBlue.400", borderColor: "darkBlue.700", borderWidth: 1,
                }}
                _selectedItem={{
                  bg: 'darkBlue.400', endIcon: <CheckIcon size="5" color="green.500" />,
                }}
                _item={{
                  bg: "darkBlue.300", _text: { color: "darkBlue.700" }, _pressed: { bg: "darkBlue.500", },
                }}
              >
                {Object.entries(ResiduoType).map(([key, value]) => (
                  <Select.Item label={value} value={value} key={key} />
                ))}
              </Select>
            </Box>
          }

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
                  {isEditing ?
                    <Text color="emerald.400" fontStyle="italic" ml={2} numberOfLines={2} maxW={'80%'}>
                      Endereço: {selectedItem ? selectedItem.locale.address : ''}
                    </Text>
                    :
                    <HStack alignSelf="center">
                      <Text color="emerald.400" fontSize="sm" maxW="87%" numberOfLines={2}>
                        Endereço: {selectedItem ? selectedItem.locale.address : 'Endereço'}
                      </Text>
                      <Pressable _pressed={{ opacity: 50 }} onPress={() => { setIsEditingAddress(!isEditingAddress) }} alignSelf="center">
                        <Icon
                          as={MaterialIcons}
                          name={'mode-edit'}
                          color="green.400"
                          size={6}
                          alignSelf="center"
                          ml={3}
                        />
                      </Pressable>
                    </HStack>
                  }
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
          {!isEditing && isEditingAddress &&
            <Box justifyContent="center" alignItems="center" bgColor="darkBlue.700">
              <Input h={6} w="100%" p={1} m={1} borderWidth={0} color="blue.200" fontSize="md" textAlign="center" alignContent="center"
                placeholder={selectedItem ? selectedItem.locale.address : 'Endereço'}
                placeholderTextColor="green.400"
                onSubmitEditing={() => { }}
                returnKeyType="send"
                onChangeText={setCollectAddress}
              />
            </Box>
          }
          <HStack justifyContent="space-evenly" bgColor="darkBlue.800" mt={1} flex={1}>
            {isEditing ?
              <Text m={1} color="emerald.400" fontFamily="body" fontSize="sm">
                STATUS: {selectedItem ? selectedItem.status : ''}
              </Text>
              :
              <HStack alignSelf="center">
                <Text m={1} color="emerald.400" fontSize="sm" maxW="80%" numberOfLines={3}>
                  STATUS: {selectedItem ? selectedItem.status : 'status'}
                </Text>
                <Pressable _pressed={{ opacity: 50 }} onPress={() => { setIsEditingStatus(!isEditingStatus) }} alignSelf="center">
                  <Icon
                    as={MaterialIcons}
                    name={'mode-edit'}
                    color="green.400"
                    size={6}
                    alignSelf="center"
                    ml={1}
                  />
                </Pressable>
              </HStack>
            }

            {isEditing ?
              <Text m={1} color="emerald.400" fontFamily="body" fontSize="sm">
                GRAVIDADE: {selectedItem ? selectedItem.gravity : ''}
              </Text>
              :

              <HStack alignSelf="center" >
                <Text m={1} color="emerald.400" fontSize="sm" maxW="80%" numberOfLines={3}>
                  GRAVIDADE: {selectedItem ? selectedItem.gravity : 'gravidade'}
                </Text>
                <Pressable _pressed={{ opacity: 50 }} onPress={() => { setIsEditingGravity(!isEditingGravity) }} alignSelf="center">
                  <Icon
                    as={MaterialIcons}
                    name={'mode-edit'}
                    color="green.400"
                    size={6}
                    alignSelf="center"
                    ml={1}
                  />
                </Pressable>
              </HStack>
            }
          </HStack>
          {!isEditing && isEditingStatus &&
            <Box w="100%" justifyContent="center" alignItems="center" mt={1}>
              <Select
                selectedValue={statusType}
                onValueChange={handleStatusTypeChange}
                bgColor="darkBlue.700" fontSize="sm" color="green.400" borderWidth={0}
                h={10} w="100%"
                placeholder="Status"
                placeholderTextColor={colors.green[400]}
                dropdownIcon={<Icon as={Ionicons} name="chevron-down" size="7" color="green.400" mr={5} mt={2} />}
                _actionSheetContent={{
                  bg: "darkBlue.400", borderColor: "darkBlue.700", borderWidth: 1,
                }}
                _selectedItem={{
                  bg: 'darkBlue.400', endIcon: <CheckIcon size="5" color="green.500" />,
                }}
                _item={{
                  bg: "darkBlue.300", _text: { color: "darkBlue.700" }, _pressed: { bg: "darkBlue.500", },
                }}
              >
                {Object.entries(StatusEnum).map(([key, value]) => (
                  <Select.Item label={value} value={value} key={key} />
                ))}
              </Select>
            </Box>
          }

          {!isEditing && isEditingGravity &&
            <Box w="100%" justifyContent="center" alignItems="center" mt={1}>
              <Select
                selectedValue={gravityType}
                onValueChange={handleGravityTypeChange}
                bgColor="darkBlue.700" fontSize="sm" color="green.400" borderWidth={0}
                h={10} w="100%"
                placeholder="Gravidade"
                placeholderTextColor={colors.green[400]}
                dropdownIcon={<Icon as={Ionicons} name="chevron-down" size="7" color="green.400" mr={5} mt={2} />}
                _actionSheetContent={{
                  bg: "darkBlue.400", borderColor: "darkBlue.700", borderWidth: 1,
                }}
                _selectedItem={{
                  bg: 'darkBlue.400', endIcon: <CheckIcon size="5" color="green.500" />,
                }}
                _item={{
                  bg: "darkBlue.300", _text: { color: "darkBlue.700" }, _pressed: { bg: "darkBlue.500", },
                }}
              >
                {Object.entries(ResiduoGravity).map(([key, value]) => (
                  <Select.Item label={value} value={value} key={key} />
                ))}
              </Select>
            </Box>
          }

          <HStack px={1} py={1} mt={1} bgColor="darkBlue.800" rounded="lg" borderTopRadius={0}>

            {isEditing ?
              <HStack flex={1} justifyContent="space-evenly">
                <Pressable _pressed={{ opacity: 50 }}
                  onPress={ selectedItem?.id !== undefined ? () => toggleEdit() : () => Alert.alert("Atenção", "Selecione uma coleta!")} alignSelf="center">
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
                  alignSelf="center"
                  onPress={selectedItem?.id !== undefined ?
                    () => Alert.alert(
                      "Atenção",
                      `Deletar coleta ${selectedItem?.id}?\nEssa ação não pode ser revertida!`,
                      [
                        {
                          text: "Não",
                          style: "cancel"
                        },
                        {
                          text: "Sim",
                          onPress: () => handleDeleteComplaintAndCollect()
                        }
                      ]
                    )
                    :
                    () => Alert.alert("Atenção", "Selecione uma coleta!")
                  }
                >
                  <Icon
                    as={MaterialIcons}
                    name={'delete-forever'}
                    color="danger.700"
                    size={7}
                    alignSelf="center"
                  />
                  <Text color="danger.700" fontFamily="body" fontSize="sm">Deletar</Text>
                </Pressable>
              </HStack>
              : <Box />
            }
            {!isEditing ?
              <HStack flex={1} justifyContent="space-evenly">
                <Pressable _pressed={{ opacity: 50 }}
                  alignSelf="center"
                  onPress={toggleEdit}
                >
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
                  alignSelf="center"
                  onPress={selectedItem?.id !== undefined ?
                    () => Alert.alert(
                      "Atenção",
                      `Salvar alterações da coleta ${selectedItem?.id}?\nEssa ação não pode ser revertida!`,
                      [
                        {
                          text: "Não",
                          style: "cancel"
                        },
                        {
                          text: "Sim",
                          onPress: () => handleEditCollect()
                        }
                      ]
                    )
                    :
                    () => Alert.alert("Atenção", "Selecione uma coleta!")
                  }
                >
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
              : <Box />
            }

          </HStack>
        </ScrollView>
      </VStack>
    </VStack >
  );
}