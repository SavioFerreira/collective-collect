import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { HStack, VStack, Text, View, Icon, Pressable, ScrollView, FlatList, Input } from "native-base";
import { MaterialIcons, FontAwesome6, Feather } from '@expo/vector-icons';
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";
import { ColetaDTO } from "@dtos/ColetaDTO";
import { FormatDate } from "@functions/FormatDate";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";


type Props = IViewProps & {
    coleta: ColetaDTO;
}

type MessageDTO = {
    id: string;
    content: string;
    timestamp: string;
    user: UserDTO
}


export function ChatModal({ coleta, ...rest }: Props) {
    const [isModalVisible, SetIsModalVisible] = useState(false);
    const { user } = useAuth();

    const [message, setMessage] = useState<MessageDTO[]>([]);
    const [content, setContent] = useState('');

    function toggleModal() {
        SetIsModalVisible(!isModalVisible);
    }

    async function fetchMessage() {
        // código para buscar mensagens
    };

    async function sendMessage() {
        // código para enviar mensagens
    };

    useEffect(() => {
        fetchMessage();
    }, []);

    return (
        <View alignItems="flex-start" {...rest}>
            <Pressable onPress={toggleModal} _pressed={{ opacity: 70 }}>
                <Icon
                    textAlign="center"
                    alignSelf="center"
                    as={MaterialIcons}
                    name={"chat"}
                    color="yellow.400"
                    size="lg"
                />
                <Text fontFamily="body" fontSize="xs" color="yellow.400" mb={1}>
                    Iniciar Chat
                </Text>
            </Pressable>
            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
            >
                <Pressable flex={1} alignItems="center" justifyContent="center" bg="rgba(0, 0, 0, 0.623)">
                    <View bgColor="darkBlue.300" p={5} pt={1} pb={1} justifyContent="end" borderRadius="lg" w="95%" h="80%">
                        <Icon alignSelf="flex-end" size={8} color="green.400"
                            as={Feather}
                            name="x-circle"
                            onPress={toggleModal}
                        />
                        <VStack>
                            <VStack>
                                <HStack justifyContent="space-around" mb={2}>
                                    <Text numberOfLines={1} fontSize="md" fontFamily="body" color="white">
                                        Coleta {coleta.id} - {FormatDate(coleta.collectDate)}
                                    </Text>
                                </HStack>
                                <View bgColor="blue.400" rounded="lg">
                                    <FlatList
                                        h="230"
                                        data={message}
                                        renderItem={({ item }) => (
                                            <Text>{item.user.name}: {item.content}</Text>
                                        )}
                                        keyExtractor={item => item.id.toString()}
                                    />
                                </View>
                            </VStack>
                            <HStack rounded="lg" bgColor="blue.500" mt={2}>
                                <VStack m={1}>
                                    <Icon
                                        as={FontAwesome6}
                                        name={"user"}
                                        color="green.400"
                                        size={7}
                                        ml={1}
                                    />
                                    <Text numberOfLines={1} fontSize="md" fontFamily="body" color="green.400">
                                        {user.name}
                                    </Text>
                                </VStack>
                                <View flex={1} alignSelf="center">
                                    <Input
                                        value={content}
                                        onChangeText={setContent}
                                        placeholder="Digitar"
                                        placeholderTextColor="green.400"
                                        fontSize="md"
                                        color="white"
                                    />
                                </View>
                                <Pressable onPress={sendMessage} _pressed={{ opacity: 60 }} alignSelf="center" m={1}>
                                    <Icon
                                        textAlign="center"
                                        alignSelf="center"
                                        as={MaterialIcons}
                                        name={"send"}
                                        color="green.400"
                                        size="lg"
                                    />
                                </Pressable>
                            </HStack>
                        </VStack>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
