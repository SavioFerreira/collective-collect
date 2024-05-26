import { useState } from "react";
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { HStack, VStack, Text, View, Flex, Icon, Pressable } from "native-base";
import { FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";


type Props = IViewProps & {
    label: string;
    description?: string;
    descriptions?: {
        title: string;
        desc1: string;
        desc2: string
    }
}

export function HelpModal({ label, description, descriptions, ...rest }: Props) {
    const [isModalVisible, SetIsModalVisible] = useState(false);

    function toggleModal() {
        SetIsModalVisible(!isModalVisible);
    }

    return (
        <View alignItems="flex-start" {...rest}>
            <Pressable onPress={toggleModal} _pressed={{ opacity: 70 }}>
                <Icon
                    textAlign="center"
                    alignSelf="center"
                    as={Entypo}
                    name={"help-with-circle"}
                    color="darkBlue.700"
                    size={8}
                />
            </Pressable>
            <Modal
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={toggleModal}
                transparent={true}
            >
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <Flex flex={1} alignItems="center" justifyContent="initial" bg="rgba(7, 147, 190, 0.4)">
                        <View bgColor="cyan.200" p={10} justifyContent="center" borderRadius="lg" w="90%">
                            <VStack space={3}>
                                <HStack justifyContent='center'>
                                    <Text numberOfLines={1} fontSize="xl" fontFamily="heading" color="darkBlue.700" mb={1} textAlign="center">
                                        {label}
                                    </Text>
                                    <Icon

                                        as={FontAwesome6}
                                        name={"map-location-dot"}
                                        color="blue.700"
                                        size={7}
                                        ml={3}
                                    />
                                </HStack>

                                {description ?
                                    <Text numberOfLines={10} fontSize="lg" fontFamily="body" color="darkBlue.700" maxW="97%" textAlign="justify">
                                        {description}
                                    </Text>
                                    :
                                    <Text numberOfLines={10} fontSize="lg" fontFamily="body" color="darkBlue.700" maxW="97%" textAlign="justify">
                                        {descriptions?.title} {descriptions?.desc1} {descriptions?.desc2}
                                    </Text>
                                }

                            </VStack>
                        </View>
                    </Flex>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
