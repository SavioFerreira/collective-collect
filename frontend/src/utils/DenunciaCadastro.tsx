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

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


type Props = {
    onRegister: () => void;
}

type Complaint = DenunciaDTO;

export function DenunciaCadastro({ onRegister }: Props) {

    const { colors } = useTheme();
    const [isLoading, setIsloading] = useState(false);
    const [description, setDescription] = useState<string>("");
    const [locale, setLocale] = useState<string>("");
    const [wasteType, setWasteType] = useState<ResiduoType | undefined>(undefined);
    const [gravityType, setGravityType] = useState<ResiduoGravity | undefined>(undefined);
    const title = "Resíduos de " + wasteType?.toLocaleLowerCase();

    const [imageIsLoading, setImageIsLoading] = useState(false);
    const [imageComplaint, SetImageComplaint] = useState('https://imgflip.com/s/meme/Futurama-Fry.jpg');

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

    async function handleImageComplaintSelect() {
        setImageIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });

            if (photoSelected.canceled) return;
            if (photoSelected.assets[0].uri) {
                SetImageComplaint(photoSelected.assets[0].uri);
                console.log("Imagem da camera ou galeria! ")
                console.log(imageComplaint)
            }

        } catch (error) {
            throw error;
        } finally {
            setImageIsLoading(false);
        }
    }

    async function getCameraPermission() {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Desculpe, precisamos de permissões de câmera para fazer isso funcionar!');
            return false;
        }
        return true;
    }

    async function handleImageComplaintCatch() {
        const hasPermission = await getCameraPermission();
        if (!hasPermission) {
            return;
        }

        try {
            setImageIsLoading(true);
            const photoCaptured = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
            });

            if (photoCaptured.canceled) return;
            if (photoCaptured.assets[0].uri) {
                SetImageComplaint(photoCaptured.assets[0].uri);
                console.log("Imagem da camera ou galeria! ")
                console.log(imageComplaint)
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao capturar a imagem.');
        } finally {
            setImageIsLoading(false);
        }
    }


    async function handleCreateComplaint() {
        if (!title || title.length === 0 ||
            !description || description.length === 0 ||
            !locale || locale.length === 0 ||
            !wasteType || !gravityType) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return
        }

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
            date: `${date.toISOString()}`,
            image: imageComplaint
        };

        const result = handleFetchComplaint(complaintData);
        if (await result === 'success') {
            onRegister();
            toast.show({
                title: `Obrigado, ${user.name}. Sua denúncia foi registrada com sucesso!`,
                placement: 'top',
                duration: 5000,
                bgColor: 'green.600',
            });
        }
    };

    async function handleFetchComplaint(complaint: DenunciaDTO) {
        try {

            setIsloading(true);
            await api.post('/api/complaint', complaint);
            return 'success'

        } catch (error) {
            setIsloading(false);
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.';
            Alert.alert("Erro", `${title}`
            )
            return 'fail';
        } finally {
            setIsloading(false);
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
                                    onPress={handleImageComplaintCatch}>
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
                                    onPress={handleImageComplaintSelect}>
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