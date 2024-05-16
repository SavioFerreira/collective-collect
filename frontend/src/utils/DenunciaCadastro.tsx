import React, { useEffect, useState } from 'react';
import { View, Text, Heading, Center, Button, useTheme, HStack, VStack, Input, Icon, Select, CheckIcon, Pressable, useToast } from "native-base";
import { Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ResiduoGravity } from '../enums/ResiduoGravityEnum';
import { ResiduoType } from '../enums/ResiduoTypesEnum';
import { DenunciaDTO } from '@dtos/DenunciaDTO';
import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { useImagePicker } from '@hooks/useImagePicker';
import { getAddressLocation } from './getArdressLocation';
import * as Location from 'expo-location';
import { FormatDate } from 'src/functions/FormatDate';

type Props = {
    onRegister: () => void;
}

export function DenunciaCadastro({ onRegister }: Props) {
    const { colors } = useTheme();
    const { user } = useAuth();
    const toast = useToast();
    const { imageUri, pickImage, takePhoto } = useImagePicker();
    const [description, setDescription] = useState("");
    const [locale, setLocale] = useState("");
    const [wasteType, setWasteType] = useState<ResiduoType | undefined>();
    const [gravityType, setGravityType] = useState<ResiduoGravity | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    

    const handleWasteTypeChange = (itemValue: string) => {
        setWasteType(itemValue as ResiduoType);
    };

    const handleGravityTypeChange = (itemValue: string) => {
        setGravityType(itemValue as ResiduoGravity);
    };

    useEffect(() => {
        
        let subscription: Location.LocationSubscription;

        Location.watchPositionAsync({
            accuracy: Location.LocationAccuracy.High,
            timeInterval: 1000
        }, (location) => {
            getAddressLocation(location.coords)
                .then((address) => {
                    if (address) setLocale(address || 'Localização não encontrada')

                }).catch(error => {
                    console.error('Erro ao obter o endereço:', error);
                    setLocale('Erro ao definir localização');
                })
        }).then((response) => subscription = response);

        return () => {
            if (subscription)
                subscription.remove();
        }

    }, [])

    async function handleCreateComplaint() {
        setIsLoading(true);
        const fields = [
            { label: 'Descrição', value: description },
            { label: 'Local', value: locale },
            { label: 'Tipo de Resíduo', value: wasteType },
            { label: 'Gravidade', value: gravityType },
            { label: 'Imagem da Denúncia', value: imageUri }
        ];

        const emptyField = fields.find(field => !field.value);
        if (emptyField) {
            Alert.alert('Atenção', `Preencha todos os campos!\n${emptyField.label} não foi preenchido`);
            setIsLoading(false);
            return;
        }

        const complaintData = {
            id: undefined,
            author: { id: user.id },
            title: `Resíduos de ${wasteType?.toLocaleLowerCase()}`,
            description,
            type: wasteType ?? ResiduoType.INDEFINIDO,
            gravity: gravityType ?? ResiduoGravity.ALTO,
            status: undefined,
            locale,
            complaintDate: new Date().toISOString(),
            image: imageUri ?? 'imagem indisponivel'
        };

        const result = handleFetchComplaint(complaintData);
        if (await result === 'success') {
            onRegister();
            toast.show({
                title: `Obrigado, ${user.name}.\nSua denúncia foi registrada com sucesso!\nEla está disponível para visualização em Coletas.`,
                placement: 'top',
                duration: 8000,
                bgColor: 'green.600',
            });
            setIsLoading(false);
        } setIsLoading(false);
    };

    async function handleFetchComplaint(complaint: DenunciaDTO) {
        setIsLoading(true);
        const formData = new FormData();

        formData.append('complaint', JSON.stringify({
            ...complaint,
            image: undefined
        }));

        if (complaint.image) {
            const date = new Date().toISOString();
            const dateTimeImageSelected = FormatDate(date.toString()).replaceAll('/', '-').replaceAll(':', '-').replaceAll(' ', '_');
            formData.append('image', {
                uri: complaint.image,
                type: 'image/png',
                name: `complaint_${dateTimeImageSelected.toString()}_autor-${complaint.author.id}.png`
            } as any);
        }

        try {
            const response = await api.post('/api/complaint', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                return 'success';
            } else {
                throw new Error('Falha ao enviar Denuncia!');
            }
        } catch (error) {
            console.error("Error:", error);
            return 'fail';
        } finally {
            setIsLoading(false);
        }
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
                                    onPress={takePhoto}>
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
                                    onPress={pickImage}>
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
                    onPress={handleCreateComplaint}
                    isLoading={isLoading}>
                    Concluir Cadastro
                </Button>
            </ScrollView>
        </View >
    );
}