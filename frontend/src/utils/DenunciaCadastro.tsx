import React, { useState } from 'react';
import { View, Text, Heading, Center, Button, useTheme, HStack, VStack, Input, Icon, Select, CheckIcon, Pressable, useToast } from "native-base";
import { Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ResiduoGravity } from '../enums/ResiduoGravityEnum';
import { ResiduoType } from '../enums/ResiduoTypesEnum';
import { DenunciaDTO } from '@dtos/DenunciaDTO';
import { api } from '@services/api';
import { AppError } from './AppError';
import { useAuth } from '@hooks/useAuth';

type Props = {
    onRegister: () => void;
}

type Complaint = DenunciaDTO;

export function DenunciaCadastro({ onRegister }: Props) {

    const { colors } = useTheme();
    const [isLoading, setIsloading] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [locale, setLocale] = useState<string>("");
    const [complaintImage, setComplaintImage] = useState<string>("");
    const [wasteType, setWasteType] = useState<ResiduoType | undefined>(undefined);
    const [gravityType, setGravityType] = useState<ResiduoGravity | undefined>(undefined);

    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const toast = useToast();
    const { user } = useAuth();

    const handleWasteTypeChange = (itemValue: string) => {
        setWasteType(itemValue as ResiduoType);
    };

    const handleGravityTypeChange = (itemValue: string) => {
        setGravityType(itemValue as ResiduoGravity);
    };

    async function handleCreateComplaint() {
        if (!title || title.length === 0 ||
            !description || description.length === 0 ||
            !locale || locale.length === 0 ||
            !wasteType || !gravityType) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return
        }

        const complaintDate = date.toLocaleDateString('pt-BR');
        const complaintTime = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
        setComplaintImage('vazio absoluto');

        const complaintData: DenunciaDTO = {
            id: undefined,
            author: {
                id: user.id 
            },
            title: title,
            description: description,
            type: wasteType,
            gravity: gravityType,
            status: undefined,
            locale: locale,
            date: `${date} ${time}`,
            image: complaintImage,
        };

        console.log("Dados do modal: ")
        console.log({
            title,
            description,
            locale,
            wasteType,
            gravityType,
            complaintImage,
            date,
            time
        });

        const result = handleFetchComplaint(complaintData);
        if (await result === 'sucess') {
            onRegister();
            toast.show({
                title: `Obrigado, ${user.name}. Sua denúncia foi registrada com sucesso!`,
                placement: 'top',
                bgColor: 'green.600',
            });
        }
    };

    async function handleFetchComplaint(complaint: DenunciaDTO) {
        try {
            setIsloading(true);''
            await api.post('/api/complaint', complaint);
            return 'sucess';

        } catch (error) {
            console.log("dados de erro do backend");
            console.log(error);
            setIsloading(false);
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.';
            Alert.alert("Ops!", `Erro: ${title}`
            )
            return 'fail';
        } finally {
            return 'fail';
        }
    }

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
                        onChangeText={setTitle}
                        value={title}
                    />

                    <Text color='blue.300' fontFamily="body" fontSize="sm" mb={1} textAlign="left" fontStyle="italic">
                        Descrição da Denúncia
                    </Text>
                    <Input h={10} mb={2} bgColor="darkBlue.600" fontSize="md" color="green.400" borderWidth={0}
                        _focus={{ borderWidth: 1, borderColor: 'blue.300', bgColor: 'darkBlue.700' }}
                        placeholder='Descrição' placeholderTextColor={colors.green[400]}
                        numberOfLines={3}
                        textAlign="justify"
                        onChangeText={setDescription}
                        value={description}
                    />

                    <Text color='blue.300' fontFamily="body" fontSize="sm" mb={1} textAlign="left" fontStyle="italic">
                        Tipo ou tipos de resíduos
                    </Text>
                    <Select
                        selectedValue={wasteType}
                        onValueChange={handleWasteTypeChange}
                        bgColor="darkBlue.600" fontSize="md" color="green.400" borderWidth={0}
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
                        selectedValue={gravityType}
                        onValueChange={handleGravityTypeChange}
                        bgColor="darkBlue.600" fontSize="md" color="green.400" borderWidth={0}
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
                        textAlign="justify"
                        onChangeText={setLocale}
                        value={locale}
                    />

                    <Text color='blue.300' fontFamily="body" fontSize="sm" mb={1} textAlign="left" fontStyle="italic">
                        Captura do resíduo
                    </Text>
                    <VStack borderRadius="md" bgColor="darkBlue.600" h={16} justifyContent="center">
                        <HStack justifyContent="space-evenly" m={6}>
                            <VStack>
                                <Pressable
                                    _pressed={{ opacity: 60 }}
                                    onPress={() => { console.log('Cliclou na camera do pressable') }}>
                                    <Icon alignSelf="center" size={9} color="green.400"
                                        as={MaterialCommunityIcons}
                                        name="camera-marker-outline"
                                    />
                                    <Text color="green.400" fontFamily="body" fontSize="xs" mb={1}>
                                        Tirar Foto
                                    </Text>
                                </Pressable>
                            </VStack>
                            <Text alignSelf="center" color="green.400" fontSize="md" fontFamily="heading">
                                Ou
                            </Text>
                            <VStack>
                                <Pressable
                                    _pressed={{ opacity: 60 }}
                                    onPress={() => { console.log('Cliclou na galeria do pressable') }}>
                                    <Icon alignSelf="center" size={9} color="green.400"
                                        as={MaterialCommunityIcons}
                                        name="file-image-marker"
                                    />
                                    <Text color="green.400" fontFamily="body" fontSize="xs" mb={1} >
                                        Galeria
                                    </Text>
                                </Pressable>

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
                    onPress={handleCreateComplaint}>
                    Concluir Cadastro
                </Button>
            </ScrollView>
        </View >
    );
}