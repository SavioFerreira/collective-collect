import React, { useEffect, useState } from 'react';
import { View, Text, Heading, Center, Switch, Button, useTheme, useToast, VStack, Box } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native';
import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

type Props = {
    onRegister: () => void;
    collectId: number;
};

export function ColetaCadastroFull({ onRegister, collectId }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [teamCollect, setTeamCollect] = useState<boolean>(true);

    const [date, setDate] = useState<Date>(new Date()); 
    const [initialDate, setInitialDate] = useState<Date>(new Date()); 
    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');

    const { user } = useAuth();
    const { colors } = useTheme();
    const toast = useToast();

    function toggleSwitch() {
     setTeamCollect(previousState => !previousState);
    }  

    const onChange = (_event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setShowPicker(false);
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setShowPicker(true);
        setMode(currentMode);
    };

    useEffect(() => {
        setInitialDate(new Date()); 
    }, []);


    async function handleRegisterCollaborator() {
        setIsLoading(true);
        try {
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const localISOTime = new Date(date.getTime() - timezoneOffset).toISOString();
            const response = await api.post(`/api/collect/${collectId}/addParticipant`, { date: localISOTime, teamCollect, user, collectId });
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
                <Text color='white' fontFamily="body" fontSize="md" mb={2}>
                    Qual Horário e dia estará disponível para realizar a coleta?
                </Text>
                <Button bgColor="darkBlue.600" onPress={() => showMode('date')}>
                    Escolher data
                </Button>
                <Text textAlign="center" mb={2} color="blue.200">
                    {date.toLocaleDateString('pt-BR')}
                </Text>
                <Button bgColor="darkBlue.600" onPress={() => showMode('time')}>
                    Escolher horário
                </Button>
                { date.toTimeString() === initialDate.toTimeString() ? <Box mb={7}/> :
                <Text textAlign="center" mb={2} color="blue.200">
                    {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </Text>
                }
                {showPicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
                <View flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Text color='white' fontFamily="body" fontSize="md">
                        Fazer a atividade em equipe?
                    </Text>
                    <VStack>
                        <Text color='white' fontFamily="body" fontSize={10} mb={-3}>
                            NÃO  -  SIM
                        </Text>
                        <Switch
                            thumbColor={teamCollect ? colors.darkBlue[600] : colors.green[500]}
                            trackColor={{ false: colors.green[300], true: colors.darkBlue[200]}}
                            ios_backgroundColor={colors.green[500]}
                            mr={3}
                            onToggle={toggleSwitch}
                            value={teamCollect}
                        />
                    </VStack>
                </View>
                <Button
                    mt={2}
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
