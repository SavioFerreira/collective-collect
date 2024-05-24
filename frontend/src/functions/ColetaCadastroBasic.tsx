import React, { useEffect, useState } from 'react';
import { View, Text, Heading, Center, Switch, Button, useTheme, useToast, VStack, Spacer, Box } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alert, ScrollView } from 'react-native';
import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { UserDTO } from '@dtos/UserDTO';
import { FormatDate } from './FormatDate';
import { AppError } from '@utils/AppError';
import { boolean } from 'yup';

type Props = {
    onRegister: () => void;
    collectId: number;
};

export function ColetaCadastroBasic({ onRegister, collectId }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const toast = useToast();

    async function handleRegisterCollaborator() {
        setIsLoading(true);
        try {
            const response = await api.post(`/api/collect/${collectId}/addParticipant`, { data: '', boolean: true , user, collectId });
            if (response.status === 200) {
                onRegister();
                toast.show({
                    title: 'Seu cadastro foi registrado com sucesso!',
                    placement: 'top',
                    bgColor: 'green.500'
                });
            } else {
                throw new Error('Falha ao enviar cadastro!');
            }
        } catch (error) {
            onRegister();
            const title = error instanceof AppError ? error.message : 'Falha\n Não foi possível realizar o cadastro. Tente novamente mais tarde.';
            toast.show({
                title,
                placement: 'top',
                bgColor: 'error.500'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View flex={1} px={1}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Center>
                    <Heading color='white' mb={3}>Cadastro Coleta</Heading>
                </Center>
                <Text color='blue.200' fontFamily="body" fontSize="lg" mb={2} textAlign="justify">
                    A data e hora para a realização da coleta já foi definida, mas a coleta está publica.
                </Text>
                <Text color='blue.200' fontFamily="body" fontSize="lg" mb={2} textAlign="justify">
                    Você pode conversar com os membros da coleta para alinhar questões de data e horário e se a data for alterada, o primeiro membro pode realizar a altação.
                </Text>
                <Button
                    mt={5}
                    h={16}
                    bgColor="green.500"
                    _pressed={{ bg: "green.400" }}
                    onPress={handleRegisterCollaborator}
                    isLoading={isLoading}>
                    Concluir Cadastro
                </Button>
            </ScrollView>
        </View>
    );
};
