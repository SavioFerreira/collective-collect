import { useEffect, useState } from "react";
import { Modal } from 'react-native';
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
        const response = await api.get(`api/chat/${coleta.id}`);
        const data = await response.data();
        setMessage(data);
    };

    async function sendMessage() {
        await api.post('api/message/', {
                chart: {id: coleta.id},
                user: {id: user.id, name: user.name, email: user.email },
                content: content
            });

        setContent('');
        fetchMessage();
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
                    <View bgColor="darkBlue.300" p={5} justifyContent="center" borderRadius="lg" w="95%" h="90%" >
                        <Icon alignSelf="flex-end" size={8} color="blue.700"
                            as={Feather}
                            name="x-circle"
                            mb={4}
                            onPress={toggleModal}
                        />

                        <VStack borderWidth={1} borderColor="blue.200" p={2} rounded="lg" h={600}>
                            <HStack justifyContent="space-around" mb={4}>
                                <Icon
                                    as={MaterialIcons}
                                    name={"chat"}
                                    color="blue.700"
                                    size={7}
                                    alignSelf="center"
                                />
                                <Text numberOfLines={1} fontSize="md" fontFamily="heading" color="white">
                                    Coleta {coleta.id} - {FormatDate(coleta.collectDate)}
                                </Text>
                                <Icon
                                    as={FontAwesome6}
                                    name={"map-location-dot"}
                                    color="blue.700"
                                    size={7}
                                    alignSelf="center"
                                />
                            </HStack>
                            <View flex={1} bgColor="blue.400" rounded="lg">
                                <FlatList
                                    data={message}
                                    renderItem={({ item }) => (
                                      <Text>{item.user.name}: {item.content}</Text>
                                    )}

                                    keyExtractor={item => item.id.toString()}
                                />
                            </View>
                            <HStack rounded="lg" bgColor="blue.600" mt={2}>
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
