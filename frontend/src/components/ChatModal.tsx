import { useEffect, useState } from "react";
import { Alert, Modal } from 'react-native';
import { HStack, VStack, Text, View, Icon, Pressable, FlatList, Input } from "native-base";
import { MaterialIcons, FontAwesome6, Feather } from '@expo/vector-icons';
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";
import { ColetaDTO } from "@dtos/ColetaDTO";
import { FormatDate } from "@functions/FormatDate";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";


type Props = IViewProps & {
    coleta: ColetaDTO;
}

type MessageDTO = {
    id: string;
    content: string;
    timestamp: string;
    userName: string
}


export function ChatModal({ coleta, ...rest }: Props) {
    const [isModalVisible, SetIsModalVisible] = useState(false);
    const { user } = useAuth();

    const [message, setMessage] = useState<MessageDTO[]>([]);
    const [content, setContent] = useState<string>('');

    function toggleModal() {
        SetIsModalVisible(!isModalVisible);
    }

    async function fetchChatAndMessages() {
        try {
            const response = await api.get(`/api/collect/${coleta.id}/chat`);
            const chat = response.data;
            const messageResponse = await api.get(`/api/chat/${chat.chatId}/messages`);
            setMessage(messageResponse.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar as mensagens do chat';
        }
    }

    async function sendMessage() {
        try {
            let response = await api.get(`/api/collect/${coleta.id}/chat`);
            if (!response.data || !response.data.chatId) {
                response = await api.post(`/api/collect/${coleta.id}/chat`);
            }
            
            const chat = response.data;
            const messageResponse = await api.post(`/api/chat/${chat.chatId}/messages`, { content });
            if (messageResponse.status === 200) {
                setMessage(prev => [...prev, messageResponse.data]);
                setContent('');
            }

            if (messageResponse.status === 200) { 
                setMessage([ messageResponse.data]);
                setContent(''); 
                fetchChatAndMessages();
            }
            else {
                console.log(messageResponse.status)
            }

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível enviar a mensagem no chat';
            Alert.alert("Atenção", title);
        }
    }

    useEffect(() => {
        if (isModalVisible) {
            fetchChatAndMessages();
        }
    }, [isModalVisible]);

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
                        <VStack flex={1}>
                            <VStack flex={1} mb={2}>
                                <VStack justifyContent="space-around" alignSelf="center" mb={2}>
                                    <Text numberOfLines={1} fontSize="md" fontFamily="heading" color="white" textAlign="center">
                                        Coleta n°{coleta.id} 
                                    </Text>
                                    <Text numberOfLines={1} fontSize="sm" fontFamily="body" color="white">
                                        Agendada para: {FormatDate(coleta.collectDate)}
                                    </Text>
                                </VStack>
                                <View bgColor="blue.400" rounded="lg" flex={1}>
                                    <FlatList
                                        maxH="95%"
                                        minH="95%"
                                        data={message}
                                        renderItem={({ item }) => (
                                            <VStack mt={3} ml={5} mr={5} p={2} rounded="lg" bgColor="blueGray.300">
                                                <Text fontFamily="heading" fontSize="md" color="blue.700">
                                                    {item.userName.replaceAll('+', ' ')}
                                                </Text>
                                                <Text fontSize={10} color="blue.500">
                                                {FormatDate(item?.timestamp)}
                                                </Text>
                                                <Text fontSize="sm" color="blue.700">
                                                {item.content.replaceAll('+', ' ')}
                                                </Text>
                                            </VStack>
                                        )}
                                        keyExtractor={item => item.id.toString()}
                                    />
                                </View>
                            </VStack>
                            <HStack rounded="lg" bgColor="blue.500" minH={60} maxH={60}>
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
                                <Pressable onPress={() => sendMessage()} _pressed={{ opacity: 60 }} alignSelf="center" m={1}>
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
