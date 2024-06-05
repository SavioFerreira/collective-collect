import React, { useRef } from "react";
import MapView, { MapViewProps, PROVIDER_GOOGLE, LatLng, Marker } from "react-native-maps";
import { Icon, VStack, Text, View } from "native-base";
import { Entypo } from '@expo/vector-icons';
import { mapStyleAllBlue } from "@utils/mapStyle";

import AvatarSvg from '@assets/avatar.svg';

type Props = MapViewProps & {
    coords: LatLng[];
};

export function SelectInputMap({ coords, ...rest }: Props) {
    const lastCoord = coords[coords.length - 1];
    const mapRef = useRef<MapView | null>(null);

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
                latitudeDelta: 0.004,
                longitudeDelta: 0.004
            }, 1000);

        }
    };

    return (
        <View w="full" h="full" borderWidth={0} borderColor="green.500" borderRadius={10} overflow="hidden">
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ width: '100%', height: '100%' }}
                region={{
                    latitude: lastCoord.latitude,
                    longitude: lastCoord.longitude,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.004
                }}
                onMapLoaded={onMapLoaded}
                customMapStyle={mapStyleAllBlue}
                {...rest}
            >
                <Marker
                    title="Você"
                    identifier="user"
                    coordinate={coords[0]}
                >
                    <VStack>
                        <AvatarSvg width={45} height={45} />
                    </VStack>
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
                    name="location-pin"
                    size="9"
                    color="blue.600"
                    alignSelf="center"
                    onPress={centerMapOnUserLocation}
                />
            </VStack>
        </View>
    );
}
