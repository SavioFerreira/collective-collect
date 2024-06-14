import { useEffect, useState, useRef } from "react";
import { Modal, FlatList, ActivityIndicator } from 'react-native';
import { HStack, VStack, Text, View, Icon, Pressable, Input, useToast } from "native-base";
import { MaterialIcons, FontAwesome6, Feather } from '@expo/vector-icons';
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";
import { ColetaDTO } from "@dtos/ColetaDTO";
import { FormatDate } from "@functions/FormatDate";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { RoleType } from "@enums/RoleTypesEnum";
import { Loading } from "./Loading";

type Props = IViewProps & {
    coleta: ColetaDTO;
}

type MessageDTO = {
    id: string;
    content: string;
    timestamp: string;
    userName: string;
    role: string;
}


export function ChatModal({ coleta, ...rest }: Props) {
    const [isModalVisible, SetIsModalVisible] = useState(false);
    const { user } = useAuth();
    const toast = useToast();
    const [message, setMessage] = useState<MessageDTO[]>([]);
    const [content, setContent] = useState<string>('');

    const flatListRef = useRef<FlatList<MessageDTO>>(null);


    const scrollToBottom = () => {
        flatListRef.current?.scrollToEnd({ animated: true });
    };


    function toggleModal() {
        SetIsModalVisible(!isModalVisible);
    }

    async function fetchChatAndMessages() {
        try {
            const response = await api.get(`/api/collect/${coleta.id}/chat`);
            const chat = response.data;
            const messageResponse = await api.get(`/api/chat/${chat.chatId}/messages`);
            setMessage(messageResponse.data);
            scrollToBottom();
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar as mensagens do chat';
            toggleModal()
            toast.show({
                title: title,
                placement: 'top',
                bgColor: 'orange.400'
            })

        } finally {
        }
    }

    async function sendMessage() {
        try {
            const response = await api.get(`/api/collect/${coleta.id}/chat`);
            const chat = response.data;

            if (content.trim()) {
                const messageResponse = await api.post(`/api/chat/${chat.chatId}/messages`, { content }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (messageResponse.status === 200) {
                    setMessage(prev => [...prev, messageResponse.data]);
                    setContent('');
                    scrollToBottom();
                }
            }

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível enviar a mensagem no chat';
            toggleModal()
            toast.show({
                title: title,
                placement: 'top',
                bgColor: 'orange.400'
            })
        }
    }

    useEffect(() => {
        if (isModalVisible) {
            fetchChatAndMessages();
        }
    }, [isModalVisible]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollToBottom();
        }, 100);
        return () => clearTimeout(timeout);
    }, [message]);

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
                onShow={scrollToBottom}
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

                                <View bgColor="blue.500" rounded="lg" flex={1}>
                                    <FlatList
                                        style={{ maxHeight: "95%", minHeight: "95%" }}
                                        data={message}
                                        ref={flatListRef}
                                        renderItem={({ item }) => {
                                            const isAdmin = item.role === RoleType.ADMIN;
                                            const currentUser = item.userName === user.name ? 'você' : item.userName;
                                            const iscurrentUser = item.userName === user.name;
                                            return (
                                                <HStack justifyContent={iscurrentUser ? "flex-end" : "flex-start"}>
                                                    <VStack mt={3} mr={5} ml={5} p={2}
                                                        rounded="lg"
                                                        bgColor={isAdmin ? "purple.700" : (iscurrentUser ? "blue.300" : "darkBlue.300")}
                                                    >
                                                        <Text fontFamily="heading" fontSize="md" color={isAdmin ? "purple.200" : "blue.700"}>
                                                            {isAdmin ? 'admin' : currentUser}
                                                        </Text>
                                                        <Text fontSize="sm" color={isAdmin ? "white" : "blue.700"}>
                                                            {item.content}
                                                        </Text>
                                                        <Text fontSize={10} mt={1} textAlign="right" color={isAdmin ? "purple.300" : "blue.700"}>
                                                            {FormatDate(item?.timestamp)}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            )
                                        }}
                                        keyExtractor={item => item.id.toString()}
                                    />

                                </View>
                            </VStack>
                            <HStack rounded="lg" bgColor="blue.500" minH={60} maxH={60}>
                                <VStack m={1} maxW={12} alignSelf="center">
                                    <Icon
                                        as={FontAwesome6}
                                        name={"user"}
                                        color="green.400"
                                        size={5}
                                        ml={1}
                                        alignSelf="center"
                                    />
                                    <Text numberOfLines={1} fontSize="sm" fontFamily="body" color="green.400" maxW="16">
                                        {user.name}
                                    </Text>
                                </VStack>
                                <View flex={1} alignSelf="center">
                                    <Input
                                        value={content}
                                        onChangeText={setContent}
                                        placeholder="Digitar"
                                        placeholderTextColor="blue.500"
                                        fontSize="md"
                                        color="blue.700"
                                        cursorColor="cyan"
                                        bgColor="blue.300"
                                        returnKeyType="send"
                                        maxLength={1000}
                                        onSubmitEditing={() => sendMessage()}
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
