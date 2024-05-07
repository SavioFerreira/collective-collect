import React, { useState, useRef } from 'react';
import { View, Text, Heading, Center, Switch, Button, useTheme } from "native-base";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Props = {
    onRegister: () => void;
}

export function ColetaCadastro({ onRegister }: Props) {
    const {colors} = useTheme();
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState<boolean>(false);
    const [isExclusive, setIsExclusive] = useState<boolean>(false);

    const initialDate = useRef<Date>(new Date());
    const initialTime = useRef<Date>(new Date());

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || (mode === 'date' ? date : time);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);

        if (currentDate <= maxDate) {
            setShow(false);
            if (mode === 'date') {
                setDate(currentDate);
            } else {
                setTime(currentDate);
            }
        } else {
            alert('Por favor, escolha uma data que esteja dentro de uma semana.');
            
        }
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setShow(true);
        setMode(currentMode);
    };

    const handleCompletion = () => {
        const dateDifference = date.toISOString().slice(0, 10) === initialDate.current.toISOString().slice(0, 10);
        const timeDifference = (time.getTime() - initialTime.current.getTime()) / 60000; 

        if ((dateDifference && timeDifference >= 20) || (!dateDifference && date > initialDate.current)) {
            console.log(`Data: ${date.toLocaleDateString('pt-BR')}, Hora: ${time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })}, Exclusiva: ${isExclusive}`);
            onRegister();
        } else {
            alert("Por favor, selecione uma hora pelo menos 20 minutos à frente do horário atual ou uma data futura.");
        }
    };

    return (
        <View flex={1} px={1}>
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
                <Switch
                    isChecked={isExclusive}
                    onToggle={() => setIsExclusive(!isExclusive)}
                    thumbColor={isExclusive ? colors.green[500] : colors.darkBlue[600]}
                />
            </View>
            <Button
                mt={2}
                bgColor="green.500"
                _pressed={{ bg: "green.400" }}
                onPress={handleCompletion}>
                Concluir Cadastro
            </Button>
        </View>
    );
}