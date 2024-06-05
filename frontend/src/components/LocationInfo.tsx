import { useState } from "react";
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { HStack, VStack, Text, View, Flex, Icon, Pressable } from "native-base";
import { FontAwesome6 } from '@expo/vector-icons';
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";

type Props = IViewProps & {
    label: string;
    description: string;
}

export function LocationInfo({ label, description, ...rest }: Props) {
    const [isModalVisible, SetIsModalVisible] = useState(false);

    function toggleModal() {
        SetIsModalVisible(!isModalVisible);
    }

    return (
        <View alignItems="flex-start" {...rest}>
            <Pressable onPress={toggleModal} _pressed={{ opacity: 60 }}>
                <HStack>
                    <Icon
                        textAlign="center"
                        alignSelf="center"
                        as={FontAwesome6}
                        name={"map-location-dot"}
                        color="blue.700"
                        size={7}
                        mr={2}
                    />
                    <VStack>
                        <Text numberOfLines={1} fontSize="md" fontFamily="body" color="blue.700">
                            {label}
                        </Text>
                        <Text numberOfLines={1} fontSize="sm" fontFamily="heading" color="blue.700" maxW="98%">
                            {description}
                        </Text>
                    </VStack>
                </HStack>
            </Pressable>
            <Modal
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={toggleModal}
                transparent={true}
            >
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <Flex flex={1} alignItems="center" justifyContent="initial" bg="rgba(0, 0, 0, 0.623)">
                        <View bgColor="darkBlue.700" p={5} justifyContent="center" borderRadius="lg" w="90%">
                            <VStack borderWidth={1} borderColor="blue.400" space={3} borderRadius="lg">
                                <HStack justifyContent='center' p={1}>
                                    <Text numberOfLines={1} fontSize="xl" fontFamily="heading" color="white" mb={1} textAlign="center">
                                        {label}
                                    </Text>
                                    <Icon

                                        as={FontAwesome6}
                                        name={"map-location-dot"}
                                        color="green.500"
                                        size={7}
                                        ml={3}
                                    />
                                </HStack>
                                <Text numberOfLines={4} fontSize="lg" fontFamily="body" color="white" maxW="97%" textAlign="justify" p={2}>
                                    {description}
                                </Text>
                            </VStack>
                        </View>
                    </Flex>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
