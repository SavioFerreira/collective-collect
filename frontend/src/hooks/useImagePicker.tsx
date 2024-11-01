import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export function useImagePicker() {
    const [imageUri, setImageUri] = useState<string>();

    async function pickImage() {

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permissão necessária', 'Permissão de galeria é necessária para selecionar imagens');
            return null;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
            });

            if (result.canceled) return null;
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImageUri(result.assets[0].uri);
            }
            return result.assets[0].uri;
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        } 
    };

    async function takePhoto() {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permissão necessária', 'Permissão de câmera é necessária para tirar fotos.');
            return null;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                
                quality: 1,
                allowsEditing: true,
            });

            if (result.canceled) return null;
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImageUri(result.assets[0].uri);
            }

            return result.assets[0].uri;
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível capturar a foto.');
        } 
    };

    return {
        imageUri,
        pickImage,
        takePhoto
    };
};
