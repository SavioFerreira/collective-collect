import React, { useState, useRef } from 'react';
import { View, Text, Heading, Center, Button, useTheme, HStack, VStack, Input, Icon, Select, CheckIcon, ChevronDownIcon } from "native-base";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ResiduoGravity } from '../enums/ResiduoGravityEnum';
import { ResiduoType } from '../enums/ResiduoTypesEnum';

type Props = {
    onRegister: () => void;
}

export function DenunciaCadastro({ onRegister }: Props) {
    const { colors } = useTheme();
    const [residuoTipo, setResiduoTipo] = useState<ResiduoType | undefined>(undefined);
    const [gravidadeTipo, setGravidadeTipo] = useState<ResiduoGravity>();
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());

    const handleCompletion = () => {
        onRegister();
    };

    return (
        <View flex={1} px={1}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Center>
                    <Heading color='white'>
                        Criar Denúncia
                    </Heading>
                </Center>

                <Text color='blue.300' fontFamily="body" fontSize="md" mb={4} textAlign="center" fontStyle="italic">
                    Preencha os dados com cuidado
                </Text>
                <VStack>
                    <Text color='blue.300' fontFamily="body" fontSize="sm" mb={1} textAlign="left" fontStyle="italic">
                        Titulo da Denúncia
                    </Text>
                    <Input h={10} mb={2} bgColor="darkBlue.600" fontSize="md" color="green.400" borderWidth={0}
                        _focus={{ borderWidth: 1, borderColor: 'blue.300', bgColor: 'darkBlue.700' }}
                        placeholder='Titulo' placeholderTextColor={colors.green[400]}
                        numberOfLines={1}
                    />

                    <Text color='blue.300' fontFamily="body" fontSize="sm" mb={1} textAlign="left" fontStyle="italic">
                        Descrição da Denúncia
                    </Text>
                    <Input h={10} mb={2} bgColor="darkBlue.600" fontSize="md" color="green.400" borderWidth={0}
                        _focus={{ borderWidth: 1, borderColor: 'blue.300', bgColor: 'darkBlue.700' }}
                        placeholder='Descrição' placeholderTextColor={colors.green[400]}
                        numberOfLines={3}
                        textAlign="justify"
                    />

                    <Text color='blue.300' fontFamily="body" fontSize="sm" mb={1} textAlign="left" fontStyle="italic">
                        Tipo ou tipos de resíduos
                    </Text>

                    <Select
                        bgColor="darkBlue.600" fontSize="md" color="green.400" borderWidth={0}
                        selectedValue={residuoTipo}
                        h={10}
                        mb={2}
                        placeholder="Tipo de Resíduo"
                        placeholderTextColor={colors.green[400]}
                        dropdownIcon={<Icon as={Ionicons} name="chevron-down" size="7" color="green.400" mr={5} mt={2} />}
                        _actionSheetContent={{
                            bg: "darkBlue.400", borderColor: "darkBlue.700", borderWidth: 1,
                        }}
                        _selectedItem={{
                            bg: 'darkBlue.400', endIcon: <CheckIcon size="5" color="green.500" />,
                        }}
                        _item={{
                            bg: "darkBlue.300", _text: { color: "darkBlue.700" }, _pressed: { bg: "darkBlue.500", },
                        }}
                    >
                        {Object.entries(ResiduoType).map(([key, value]) => (
                            <Select.Item label={value} value={value} key={key} />
                        ))}
                    </Select>

                    <Text color='blue.300' fontFamily="body" fontSize="sm" mb={1} textAlign="left" fontStyle="italic">
                        Gravidade proposta para denúncia
                    </Text>

                    <Select
                        bgColor="darkBlue.600" fontSize="md" color="green.400" borderWidth={0}
                        selectedValue={gravidadeTipo}
                        h={10}
                        mb={2}
                        accessibilityLabel="Selecione a gravidade dessa denúncia"
                        placeholder="Gravidade da Denúncia"
                        placeholderTextColor={colors.green[400]}
                        dropdownIcon={<Icon as={Ionicons} name="chevron-down" size="7" color="green.400" mr={5} mt={2} />}
                        _actionSheetContent={{
                            bg: "darkBlue.400", borderColor: "darkBlue.700", borderWidth: 1,
                        }}
                        _selectedItem={{
                            bg: 'darkBlue.400', endIcon: <CheckIcon size="5" color="green.500" />,
                        }}
                        _item={{
                            bg: "darkBlue.300", _text: { color: "darkBlue.700" }, _pressed: { bg: "darkBlue.500", },
                        }}
                    >
                        {Object.entries(ResiduoGravity).map(([key, value]) => (
                            <Select.Item label={value} value={value} key={key} />
                        ))}
                    </Select>

                    <Text color='blue.300' fontFamily="body" fontSize="sm" mb={1} textAlign="left" fontStyle="italic">
                        Local/Endereço da Denúncia
                    </Text>
                    <Input h={10} mb={2} bgColor="darkBlue.600" fontSize="md" color="green.400" borderWidth={0}
                        _focus={{ borderWidth: 1, borderColor: 'blue.300', bgColor: 'darkBlue.700' }}
                        placeholder='Localização' placeholderTextColor={colors.green[400]}

                    />

                    <Text color='blue.300' fontFamily="body" fontSize="sm" mb={1} textAlign="left" fontStyle="italic">
                        Captura do resíduo
                    </Text>
                    <VStack borderRadius="md" bgColor="darkBlue.600" h={16} justifyContent="center">
                        <HStack justifyContent="space-around" m={6}>
                            <VStack>
                                <Icon alignSelf="center" size={9} color="green.400"
                                    as={MaterialCommunityIcons}
                                    name="camera-marker-outline"
                                    onPress={() => { console.log('Cliclou na câmera') }}
                                />
                                <Text color="green.400" fontFamily="body" fontSize="xs" mb={1}>
                                    Tirar Foto
                                </Text>
                            </VStack>
                            <VStack>
                                <Icon alignSelf="center" size={9} color="green.400"
                                    as={MaterialCommunityIcons}
                                    name="file-image-marker"
                                    onPress={() => { console.log('Cliclou na galeria') }}
                                />
                                <Text color="green.400" fontFamily="body" fontSize="xs" mb={1} >
                                    Galeria
                                </Text>

                            </VStack>

                        </HStack>
                    </VStack>
                </VStack>
                <Button
                    mt={4}
                    h={16}
                    size="lg"
                    bgColor="green.500"
                    _pressed={{ bg: "green.600" }}
                    onPress={handleCompletion}>
                    Concluir Cadastro
                </Button>
            </ScrollView>
        </View>
    );
}