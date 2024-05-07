import React, { useState } from 'react';
import { View, Text, Heading, Center, Switch, Button } from "native-base";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export function ColetaCadastro() {
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState<boolean>(false);
    const [isExclusive, setIsExclusive] = useState<boolean>(false);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || (mode === 'date' ? date : time);
        setShow(false);
        if (mode === 'date') {
            setDate(currentDate);
        } else {
            setTime(currentDate);
        }
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setShow(true);
        setMode(currentMode);
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
            <Text textAlign="center" mb={2} color="blue.300">
                {date.toLocaleDateString('pt-BR')}
            </Text>
            <Button bgColor="darkBlue.600" onPress={() => showMode('time')}>
                Escolher horário
            </Button>
            <Text textAlign="center" mb={2} color="blue.300">
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
                    Coleta exclusiva?
                </Text>
                <Switch
                    isChecked={isExclusive}
                    onToggle={() => setIsExclusive(!isExclusive)}
                    thumbColor={isExclusive ? 'green' : 'blue'}
                />
            </View>
            <Button
                mt={2}
                bgColor="green.500"
                _pressed={{ bg: "green.400" }}
                onPress={() => console.log(`Data: ${date.toLocaleDateString()}, Hora: ${time.toLocaleTimeString()}, Exclusiva: ${isExclusive}`)}>
                Concluir Cadastro
            </Button>
        </View>
    );
}