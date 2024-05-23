import { useState } from "react";
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { HStack, VStack, Text, View, Flex, Icon, Pressable, Box, Image, ScrollView } from "native-base";
import { FontAwesome6 } from '@expo/vector-icons';
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useImagePicker } from "@hooks/useImagePicker";

import { Video, ResizeMode } from 'expo-av';
import videoPath from '@assets/working-collect.mp4';
import React from "react";

type Props = IViewProps & {
    label: string;
}

export function OnCollectModal({ label, ...rest }: Props) {
    const [isModalVisible, SetIsModalVisible] = useState(false);
    const [isSelectPhotoVisible, setIsSelectPhotoVisible] = useState(false);
    const { pickImage, takePhoto } = useImagePicker();
    const [photoBefore, setPhotoBefore] = useState<string | null>(null);
    const [photoAfter, setPhotoAfter] = useState<string | null>(null);
    const [photoType, setPhotoType] = useState<'before' | 'after' | null>(null);

    const video = React.useRef(null);

    function toggleModal() {
        SetIsModalVisible(!isModalVisible);
    }

    function togglePhotoVisible() {
        setIsSelectPhotoVisible(!isSelectPhotoVisible);
    }


    async function handlePhotoSelection(type: 'before' | 'after') {
        togglePhotoVisible();
        setPhotoType(type); 
    };

    async function handleTakePhoto() {
        const imageUri = await takePhoto();
        setIsSelectPhotoVisible(false);
        if (photoType === 'before') {
            setPhotoBefore(imageUri ?? null);
        } else if (photoType === 'after') {
            setPhotoAfter(imageUri ?? null);
        }
    };

    async function handlePickImage() {
        const imageUri = await pickImage();
        setIsSelectPhotoVisible(false);
        if (photoType === 'before') {
            setPhotoBefore(imageUri ?? null);
        } else if (photoType === 'after') {
            setPhotoAfter(imageUri ?? null);
        }
    };

    const canFinalize = photoBefore && photoAfter;

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
                <Flex flex={1} alignItems="center" bg="rgba(74, 169, 255, 0.87)">
                    <View bgColor="blue.500" p={5} justifyContent="initial" borderRadius="lg" w="92%" h="98%">
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

                            <View rounded="xl" overflow="hidden" borderWidth={1} borderColor="blue.600" w="100%" h={200} alignSelf="center">
                                <Video
                                    ref={video}
                                    source={videoPath}
                                    isMuted={true}
                                    resizeMode={ResizeMode.COVER}
                                    shouldPlay
                                    isLooping
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </View>

                            <Text numberOfLines={2} fontSize="md" fontFamily="body" color="blue.200" textAlign="center" mt={1} mb={4}>
                                Selecione uma imagem antes de realizar a coleta e outra depois de finalizar
                            </Text>

                            { isSelectPhotoVisible ? 
                            <VStack borderRadius="md" bgColor="darkBlue.600" h={16} justifyContent="center" mb={2}>
                                <HStack justifyContent="space-evenly" m={6}>
                                    <VStack>
                                        <Pressable
                                            _pressed={{ opacity: 60 }}
                                            onPress={handleTakePhoto}>
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
                                            onPress={handlePickImage}>
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
                            : ''
                            }

                            <HStack flexDirection="row" alignSelf="center">

                                <Pressable onPress={() => {handlePhotoSelection("before")}}>
                                    <View bgColor="red.500" rounded="md" w={160} h={150} m={1}>
                                        <Text numberOfLines={2} fontSize="md" fontFamily="body" color="blue.200" textAlign="center">
                                           Adicione a  imagem de antes da coleta
                                        </Text>
                                        <Image
                                            w="100%"
                                            h="90%"
                                            source={{ uri: photoBefore ?? 'imagem indisponivel' }}
                                            alt="imagem da coleta"
                                            resizeMode="stretch"
                                            borderRadius="lg"
                                            borderTopRadius={0}

                                        />

                                    </View>
                                </Pressable>

                                <View p={1} />

                                <Pressable  disabled={photoBefore !== null ? false : true }  onPress={() => handlePhotoSelection('after')}>
                                <View bgColor="green.500" rounded="md" w={160} h={150} m={1}>
                                    <Text numberOfLines={2} fontSize="md" fontFamily="body" color="blue.200" textAlign="center">
                                      Adicione a  imagem de depois da coleta
                                    </Text>

                                    <Image
                                        w="100%"
                                        h="90%"
                                        source={{ uri: photoAfter ?? 'imagem indisponivel' }}
                                        alt="imagem da coleta"
                                        resizeMode="stretch"
                                        borderRadius="lg"
                                        borderTopRadius={0}
                                    />
                                </View>
                                </Pressable>
                            </HStack>


                            <Pressable
                                mt={10}
                                bgColor={canFinalize ? "green.400" : "blue.400"}
                                isDisabled={!canFinalize}
                                _pressed={{ opacity: 70 }}
                                size="20"
                                w="100%"
                                h={16}
                                borderRadius="md"
                                alignItems="center"
                                justifyContent="center"
                                onPress={toggleModal}
                            >
                                <Text fontFamily="heading" fontSize="xl" color="white">
                                    Finalizar
                                </Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </Flex>
            </Modal>
        </View>
    );
}

