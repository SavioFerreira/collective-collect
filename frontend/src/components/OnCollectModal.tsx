import { useState } from "react";
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { HStack, VStack, Text, View, Flex, Icon, Pressable, Box, Image, ScrollView, Spacer } from "native-base";
import { FontAwesome6 } from '@expo/vector-icons';
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useImagePicker } from "@hooks/useImagePicker";

import ampulhetaGif from '@assets/ampulheta.gif'
import ampulhetaGif2 from '@assets/ampulheta2.gif'
import ampulhetaGif3 from '@assets/ampulheta3.gif'

type Props = IViewProps & {
    label: string;
}

export function OnCollectModal({ label, ...rest }: Props) {
    const [isModalVisible, SetIsModalVisible] = useState(false);
    const { imageUri, pickImage, takePhoto } = useImagePicker();

    function toggleModal() {
        SetIsModalVisible(!isModalVisible);
    }

    return (
        <View alignItems="flex-start" {...rest}>
            <Pressable
                bgColor="blue.500"
                size="20"
                w="100%"
                h={16}
                borderRadius="md"
                alignItems="center"
                justifyContent="center"
                onPress={toggleModal}
                _pressed={{ opacity: 60 }}

            >
                <Text fontFamily="heading" fontSize="lg" color="white">
                    {label}
                </Text>
            </Pressable>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={toggleModal}
                transparent={true}

            >
                <TouchableWithoutFeedback onPress={() => { }}>
                    <Flex flex={1} alignItems="center" bg="rgba(74, 169, 255, 0.87)">
                        <View bgColor="blue.500" p={5} justifyContent="initial" borderRadius="lg" w="92%" h="90%">
                            <VStack space={2}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <HStack justifyContent='center'>
                                    <Text numberOfLines={1} fontSize={30} fontFamily="heading" color="blue.200" mb={1} textAlign="center">
                                        {label}
                                    </Text>
                                    <Icon

                                        as={FontAwesome6}
                                        name={"map-location-dot"}
                                        color="green.400"
                                        size={10}
                                        ml={3}
                                    />
                                </HStack>
                                <Box rounded="md" overflow="hidden" borderWidth={1} borderColor="blue.600" w="80%" h={200} alignSelf="center">
                                    <Image
                                        w="100%"
                                        h="100%"
                                        source={ampulhetaGif}
                                        alt="imagem da coleta"
                                        resizeMode="cover"
                                        borderRadius="md"
                                        opacity={80}
                                    />
                                </Box>
                                
                                    <Text numberOfLines={2} fontSize="md" fontFamily="body" color="blue.200" textAlign="center" mt={1}>
                                        Selecione uma imagem antes de realizar a coleta e outra depois de finalizar
                                    </Text>
                                    <VStack borderRadius="md" bgColor="darkBlue.600" h={16} justifyContent="center" mb={2}>
                                        <HStack justifyContent="space-evenly" m={6}>
                                            <VStack>
                                                <Pressable
                                                    _pressed={{ opacity: 60 }}
                                                    onPress={takePhoto}>
                                                    <Icon alignSelf="center" size={9} color="green.400"
                                                        as={MaterialCommunityIcons}
                                                        name="camera-marker-outline"
                                                    />
                                                    <Text color="green.400" fontFamily="body" fontSize="xs" mb={1}>
                                                        Tirar Foto
                                                    </Text>
                                                </Pressable>
                                            </VStack>
                                            <Text alignSelf="center" color="green.400" fontSize="md" fontFamily="heading">
                                                Ou
                                            </Text>
                                            <VStack>
                                                <Pressable
                                                    _pressed={{ opacity: 60 }}
                                                    onPress={pickImage}>
                                                    <Icon alignSelf="center" size={9} color="green.400"
                                                        as={MaterialCommunityIcons}
                                                        name="file-image-marker"
                                                    />
                                                    <Text color="green.400" fontFamily="body" fontSize="xs" mb={1} >
                                                        Galeria
                                                    </Text>
                                                </Pressable>
                                            </VStack>
                                        </HStack>
                                    </VStack>

                                    <HStack flexDirection="row" alignSelf="center">
                                        <Box bgColor="red.500" rounded="md" w={160} h={150}>
                                            <Text numberOfLines={2} fontSize="md" fontFamily="body" color="blue.200" textAlign="center">
                                                imagem antes
                                            </Text>
                                            <Image
                                                w="100%"
                                                h="90%"
                                                source={{ uri: 'https://www.cbde.org.br/images/default.jpg' }}
                                                alt="imagem da coleta"
                                                resizeMode="stretch"
                                                borderRadius="lg"
                                                borderTopRadius={0}
                                            />
                                        </Box>
                                        <View p={1} />
                                        <Box bgColor="green.500" rounded="md" w={160} h={150}>
                                            <Text numberOfLines={2} fontSize="md" fontFamily="body" color="blue.200" textAlign="center">
                                                imagem depois
                                            </Text>
                                            <Image
                                                w="100%"
                                                h="90%"
                                                source={{ uri: 'https://www.cbde.org.br/images/default.jpg' }}
                                                alt="imagem da coleta"
                                                resizeMode="stretch"
                                                borderRadius="lg"
                                                borderTopRadius={0}
                                            />
                                        </Box>
                                    </HStack>

                                    <Pressable
                                        mt={5}
                                        bgColor="green.500"
                                        _pressed={{ opacity: 70 }}
                                        size="20"
                                        w="100%"
                                        h={16}
                                        borderRadius="md"
                                        alignItems="center"
                                        justifyContent="center"
                                        onPress={toggleModal}
                                    >
                                        <Text fontFamily="heading" fontSize="lg" color="blue.200">
                                            Finalizar
                                        </Text>
                                    </Pressable>


                                </ScrollView>
                            </VStack>
                        </View>
                    </Flex>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

