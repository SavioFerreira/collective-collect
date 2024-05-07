import { Center, Heading, VStack, Image, Pressable, Text, View, Flex, Icon, HStack } from "native-base";
import { IconHeader } from "@components/IconHeader";
import BackDenunciaImg from '@assets/mapBackGround.png';
import { Feather } from '@expo/vector-icons';
import { Modal } from "react-native";
import { ColetaCadastro } from "@components/ColetaCadastro";
import { useState } from "react";

export function HomeDenuncia() {
  const [isModalVisible, SetIsModalVisible] = useState(false);

  function openColetaModal() {
    SetIsModalVisible(true);
  }

  const closeColetaModal = () => {
    SetIsModalVisible(!isModalVisible);
  };

  return (
    <VStack flex={1}>
      <IconHeader title="Denuncias" />

      <VStack flex={1} alignItems="center" justifyContent="center" m={5}>
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
      <HStack mb={5} px={5}>
        <Pressable
          bgColor="green.500"
          _pressed={{ bg: "green.600" }}
          size="20"
          w="full"
          h={16}
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
          onPress={openColetaModal}
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
          onRequestClose={closeColetaModal}
          transparent={true}
        >
          <Flex flex={1} alignItems="center" justifyContent="center" bg="rgba(74, 169, 255, 0.87)">
            <View bgColor="blue.500" p={5} pb={3} justifyContent="flex-end" borderRadius="lg" w="90%" maxW="90%" h="55%" maxH="70%" shadow={1}>
              <Icon alignSelf="flex-end" size={8} color="green.400"
                as={Feather}
                name="x-circle"
                onPress={closeColetaModal}
              />
              <ColetaCadastro onRegister={closeColetaModal} />
            </View>
          </Flex>
        </Modal>
      </View>

    </VStack>
  );
}