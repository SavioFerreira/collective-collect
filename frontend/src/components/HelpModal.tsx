import { useState } from "react";
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { HStack, VStack, Text, View, Flex, Icon, Pressable, ScrollView } from "native-base";
import { FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";


type Props = IViewProps & {
    label: string;
    description: string;

}

export function HelpModal({ label, description, ...rest }: Props) {
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
                    size={6}
                />
            </Pressable>
            <Modal
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={toggleModal}
                transparent={true}
            >
                <Pressable flex={1} alignItems="center" justifyContent="initial" bg="rgba(0, 0, 0, 0.623)" onPress={toggleModal}>
                        <View bgColor="darkBlue.700" p={8} justifyContent="center" borderRadius="lg" w="95%" >
                            <ScrollView>
                                <VStack space={3} borderWidth={1} borderColor="blue.400" p={2} rounded="lg">
                                    <HStack justifyContent='center'>
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
                                    <Text numberOfLines={40} fontSize="lg" fontFamily="body" fontStyle="italic" color="white" maxW="97%" textAlign="justify">
                                        {description}
                                    </Text>
                                </VStack>
                            </ScrollView>
                        </View>
                    </Pressable>
            </Modal>
        </View>
    );
}
