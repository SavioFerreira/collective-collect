import React, { useRef, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Icon, VStack, Text, View } from "native-base";
import { Entypo } from '@expo/vector-icons';
import { mapStyleAllBlue } from "@utils/mapStyle";
import AvatarSvg from '@assets/avatar.svg';
import { getAddressLocation } from "@utils/getArdressLocation";
import { LocationObjectCoords } from "expo-location";

type Props = {
    coords: { latitude: number, longitude: number }[];
    onSelectLocation: (location: { latitude: number, longitude: number , address: string }) => void;
};

type SelectedLocation = {
    latitude: number;
    longitude: number;
    address: string;
}

export function SelectInputMap({ coords, onSelectLocation }: Props) {

    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const lastCoord = coords[coords.length - 1];
    const mapRef = useRef<MapView | null>(null);


    const handleSelectLocation = async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const fakeLocationObject: LocationObjectCoords = {
            latitude,
            longitude,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
        };
        const address = await getAddressLocation(fakeLocationObject);
        setSelectedLocation({ latitude, longitude, address: address || "Endereço não encontrado" });
        onSelectLocation({ latitude, longitude, address: address || "Endereço não encontrado" });
    };


    return (
        <View w="full" h="full" overflow="hidden" rounded="lg">
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                    latitude: lastCoord.latitude,
                    longitude: lastCoord.longitude,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.004
                }}
                onPress={handleSelectLocation}
                customMapStyle={mapStyleAllBlue}
            >
                {selectedLocation && (
                    <Marker
                        coordinate={{ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }}
                        title="Local Selecionado"
                        description={selectedLocation.address}
                    >
                        <Icon
                            as={Entypo}
                            name={"location-pin"}
                            color={"orange.700"}
                            size={12}
                        />
                    </Marker>
                )}
                <Marker
                    title="Você"
                    coordinate={coords[0]}
                >
                    <AvatarSvg width={45} height={45} />
                </Marker>
            </MapView>
            <VStack
                zIndex={1}
                position="absolute"
                right={2}
                top={1}
                bgColor='rgba(45, 2, 145, 0.137)'
                rounded="lg"
                p={1}
            >
                <Text color="blue.600" fontFamily="heading" fontSize="xs">
                    Centralizar
                </Text>
                <Icon
                    as={Entypo}
                    name="location"
                    size="9"
                    color="blue.600"
                    alignSelf="center"
                    onPress={() => mapRef.current?.animateToRegion({
                        latitude: lastCoord.latitude,
                        longitude: lastCoord.longitude,
                        latitudeDelta: 0.004,
                        longitudeDelta: 0.004
                    }, 1000)}
                />
            </VStack>
        </View>
    );
}
