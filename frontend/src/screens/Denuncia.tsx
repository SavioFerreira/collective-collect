import { useEffect, useState } from "react";
import { Modal } from "react-native";
import { VStack, Image, Pressable, Text, View, Flex, Icon, HStack } from "native-base";
import { Feather } from '@expo/vector-icons';

import { getAddressLocation } from "@utils/getArdressLocation";
import { DenunciaCadastro } from "src/functions/DenunciaCadastro";
import BackDenunciaImg from '@assets/mapBackGround.png';
import { IconHeader } from "@components/IconHeader";
import { MapPermission } from "@components/MapPermisson";
import { Loading } from "@components/Loading";

import { useForegroundPermissions, watchPositionAsync, LocationAccuracy, LocationSubscription, LocationObjectCoords } from "expo-location";
import { LocationInfo } from "@components/LocationInfo";
import { Map } from "@functions/Map";
import { useRoute } from "@react-navigation/native";

export function Denuncia() {
  const [isModalVisible, SetIsModalVisible] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationForegroundPermission, requestLocationForegroundPermission] = useForegroundPermissions();
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<LocationObjectCoords | null>(null);
  const route = useRoute();

  function openDenunciaModal() {
    SetIsModalVisible(true);
  }

  function closeDenunciaModal() {
    SetIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    requestLocationForegroundPermission();
  }, [])

  useEffect(() => {
    if (!locationForegroundPermission?.granted) return;

    let subscription: LocationSubscription;

    watchPositionAsync({
      accuracy: LocationAccuracy.High,
      timeInterval: 1000
    }, (location) => {
      setCurrentCoords(location.coords)
      getAddressLocation(location.coords)
        .then((address) => {
          if (address) setCurrentAddress(address)

        })
        .finally(() => setIsLoadingLocation(false))
    }).then((response) => subscription = response);

    return () => {
      if (subscription)
        subscription.remove();
    }

  }, [locationForegroundPermission])

  if (!locationForegroundPermission?.granted) {
    const permissionMessage = "Você precisa permitir que o aplicativo acesse a sua localização para disponibilizar a visualização do Mapa e para criação de Denúncias.\n" +
      "Por favor, verifique suas configurações de permissão."
    return (
      <MapPermission message={permissionMessage} />
    )
  }

  if (isLoadingLocation) {
    return (
      <View flex={1}>
        <IconHeader title="Denuncias" />
        <Loading />
      </View>
    )
  }

  return (
    <VStack flex={1}>
      <IconHeader title="Denuncias" />
      {currentAddress &&
        <LocationInfo
          mt={2} mb={1} px={6}
          label="Localização atual"
          description={currentAddress}
        />
      }

      {currentCoords ?
        <VStack flex={1} alignItems="center" justifyContent="center" px={3}>
          <Map coords={[currentCoords]} />
        </VStack>
        :
        <VStack flex={1} alignItems="center" justifyContent="center" px={5}>
          <Image
            source={BackDenunciaImg}
            alt="map"
            resizeMode="cover"
            position="absolute"

            width="100%"
            height="100%"
            borderWidth={2}
            borderColor="darkBlue.500"
            borderRadius="lg"

          />
        </VStack>
      }

      <HStack mb={3} mt={3} px={3}>
        <Pressable
          bgColor="green.500"
          _pressed={{ bg: "green.600" }}
          size="20"
          w="full"
          h={16}
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
          onPress={openDenunciaModal}
        >
          <Text fontFamily="heading" fontSize="lg" color="white">
            Nova denúncia
          </Text>
        </Pressable>
      </HStack>

      <View>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={closeDenunciaModal}
          transparent={true}
        >
          <Flex flex={1} alignItems="center" justifyContent="center" bg="rgba(74, 169, 255, 0.87)">
            <View bgColor="blue.500" p={5} pb={3} justifyContent="flex-end" borderRadius="lg" w="90%" maxW="90%" h="80%" maxH="80%" shadow={1}>
              <Icon alignSelf="flex-end" size={8} color="green.400"
                as={Feather}
                name="x-circle"
                onPress={closeDenunciaModal}
              />
              <DenunciaCadastro onRegister={closeDenunciaModal} />
            </View>
          </Flex>
        </Modal>
      </View>

    </VStack>
  );
}