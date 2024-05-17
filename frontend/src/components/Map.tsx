import React, { useEffect, useRef, useState } from "react";
import MapView, { MapViewProps, PROVIDER_GOOGLE, LatLng, Marker } from "react-native-maps";
import { Icon, VStack, Text, View, useToast } from "native-base";
import { Entypo } from '@expo/vector-icons';
import { mapStyleHopper } from "@utils/mapStyle";
import { getCoordinatesFromAddress } from "@utils/getCoordinatesFromAddress";
import { api } from "@services/api";
import { ColetaDTO } from "@dtos/ColetaDTO";
import { AppError } from "@utils/AppError";

type Props = MapViewProps & {
    coords: LatLng[];
};

interface MarkerData extends ColetaDTO {
    latitude?: number;
    longitude?: number;
}

export function Map({ coords, ...rest }: Props) {
    const lastCoord = coords[coords.length - 1];
    const mapRef = useRef<MapView | null>(null);

    const [coletas, setColetas] = useState<ColetaDTO[]>([]);
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const toast = useToast();

    async function onMapLoaded() {
        if (coords.length > 1) {
            mapRef.current?.fitToSuppliedMarkers(['user'], { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 } });
        }
    }

    function centerMapOnUserLocation() {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: lastCoord.latitude,
                longitude: lastCoord.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }, 1000);
        }
    };

    async function fetchColetas() {
        try {
            const response = await api.get('api/collect');
            setColetas(response.data);
        } catch (error) {
            console.log("Erro ao buscar coletas", error);
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os dados das coletas';
            toast.show({
                title: title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    };

    useEffect(() => {
        const convertAddresses = async () => {
            const promises = coletas.map(async (coleta) => {
                const coords = await getCoordinatesFromAddress(coleta.locale);
                return { ...coleta, latitude: coords?.latitude, longitude: coords?.longitude };
            });
            const results = await Promise.all(promises);
            setMarkers(results);
        };

        if (coletas.length > 0) {
            convertAddresses();
        }
    }, [coletas]);


    useEffect(() => {
        fetchColetas();
    }, []);

    return (
        <View w="full" h="full" borderWidth={2} borderColor="blue.500" borderRadius={10} overflow="hidden">
            <MapView
                ref={mapRef}

                provider={PROVIDER_GOOGLE}
                style={{ width: '100%', height: '100%' }}
                region={{
                    latitude: lastCoord.latitude,
                    longitude: lastCoord.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                }}
                onMapLoaded={onMapLoaded}
                customMapStyle={mapStyleHopper}
                {...rest}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: marker.latitude ?? 0, longitude: marker.longitude ?? 0 }}
                        title={marker.type}
                        description={marker.status}
                    />
                ))}
    
                <Marker
                    title="Você"
                    identifier="user"
                    coordinate={coords[0]}
                >
                    <VStack>
                        <Text textAlign="center" color="blue.600" fontSize="sm">
                            Você
                        </Text>
                        <Icon
                            as={Entypo}
                            name="user"
                            size={8}
                            color="darkBlue.600"
                        />
                    </VStack>
                </Marker>
            </MapView>
            <VStack
                zIndex={1}
                position="absolute"
                right={3}
                top={1}
            >
                <Text color="darkBlue.600" fontFamily="heading" fontSize="xs">
                    Centralizar
                </Text>
                <Icon
                    as={Entypo}
                    name="location-pin"
                    size={9}
                    color="darkBlue.600"
                    alignSelf="center"
                    onPress={centerMapOnUserLocation}
                />
            </VStack>
        </View>
    );
    
}
