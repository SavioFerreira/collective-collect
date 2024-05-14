import React, { useState, useRef } from 'react';
import { View, Text, Heading, Center, Switch, Button, useTheme, useToast, VStack } from "native-base";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Alert, ScrollView } from 'react-native';
import { api } from '@services/api';
import { UserDTO } from '@dtos/UserDTO';
import { useAuth } from '@hooks/useAuth';

type Props = {
    onRegister: () => void;
    collectId: number;
}

type RegisterCollectForm = {
    user: UserDTO
    collectId: number
    date: Date
    isExclusive: boolean
}

export function ColetaCadastro({ onRegister, collectId }: Props) {
    const { colors } = useTheme();
    const [isLoading, setIsloading] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState<boolean>(false);
    const [isExclusive, setIsExclusive] = useState<boolean>(false);
    const initialDate = useRef<Date>(new Date());
    const initialTime = useRef<Date>(new Date());

    const { user } = useAuth();
    const toast = useToast();

    function showMode(currentMode: 'date' | 'time') {
        setShow(true);
        setMode(currentMode);
    };

    function onChange(event: DateTimePickerEvent, selectedDate?: Date) {
        const currentDate = selectedDate || (mode === 'date' ? date : time);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);

        let fields = [
            { label: 'date', value: date },
            { label: 'time', value: time },
            { label: 'TeamCollect', value: isExclusive },
        ];

        for (let i = 0; i < fields.length; i++) {
            if (fields[i].value === undefined || fields[i].value === null) {
                Alert.alert('Atenção', 'Preencha todos os campos!\n' + fields[i].label + "** Não foi preenchido");
                setIsloading(false);
                return;
            }
        }

        if (currentDate <= maxDate) {
            setShow(false);
            if (mode === 'date') {
                setDate(currentDate);
            } else {
                setTime(currentDate);
            }
        } else {
            Alert.alert('Atenção', 'Por favor, escolha uma data que esteja dentro de uma semana.')

        }
    };


    function handleValidateEntryRegister() {
        const dateDifference = date.toISOString().slice(0, 10) === initialDate.current.toISOString().slice(0, 10);
        const timeDifference = (time.getTime() - initialTime.current.getTime()) / 60000;

        if ((dateDifference && timeDifference >= 20) || (!dateDifference && date > initialDate.current)) {
            setIsloading(false);
            return 'sucess'
        } else {
            Alert.alert('Atenção', 'Por favor, selecione uma hora pelo menos 20 minutos à frente do horário atual ou uma data futura.')
            return 'fail'
        }
    };

    async function handleAddCollaborator() {
        setIsloading(true);
        if (handleValidateEntryRegister() === 'sucess') {

            const collectRegisterData: RegisterCollectForm = { collectId, date, user, isExclusive }
            const result = handleFetchCollaborator(collectRegisterData);
            if (await result === 'success') {
                onRegister();
                toast.show({
                    title: `Obrigado, ${user.name}\n Seu cadatro foi registrado com sucesso!`,
                    placement: 'top',
                    duration: 5000,
                    bgColor: 'green.600',
                });
                setIsloading(false);
            }
        }
        setIsloading(false);

    };

    async function handleFetchCollaborator(registerCollectForm: RegisterCollectForm) {
        setIsloading(true);

        try {
            const response = await api.post(`/api/collect/${collectId}/addParticipant`, registerCollectForm);

            if (response.status === 200) {
                return 'success';
            } else {
                throw new Error('Falha ao enviar cadastro!');
            }
        } catch (error) {
            onRegister()
            toast.show({
                title: 'Falha\n Não foi possível realizar o cadastro. tente novamente mais tarde.\n ' + error,
                placement: 'top',
                bgColor: 'error.500'
            })
            return 'fail';
        } finally {
            setIsloading(false);
        }
    };

    return (
        <View flex={1} px={1}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Center>
                    <Heading color='white' mb={3}>
                        Cadastro Coleta
                    </Heading>
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
                <Text textAlign="center" mb={2} color="blue.200">
                    {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </Text>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={mode === 'date' ? date : time}
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
                            SIM  -  NÃO
                        </Text>
                        <Switch
                        mr={3}
                            isChecked={isExclusive}
                            onToggle={() => setIsExclusive(!isExclusive)}
                            thumbColor={isExclusive ? colors.green[500] : colors.darkBlue[600]}
                        />
                    </VStack>
                </View>
                <Button
                    mt={2}
                    h={16}
                    bgColor="green.500"
                    _pressed={{ bg: "green.400" }}
                    onPress={handleAddCollaborator}
                    isLoading={isLoading}>
                    Concluir Cadastro
                </Button>
            </ScrollView>
        </View>
    );
}