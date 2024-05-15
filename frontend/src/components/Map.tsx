import MapView, { MapViewProps, PROVIDER_GOOGLE, LatLng, Marker } from "react-native-maps";
import { Icon, VStack, Text, View } from "native-base";

import { Entypo } from '@expo/vector-icons';
import { useRef } from "react";

type Props = MapViewProps & {
    coords: LatLng[];
}

export function Map({ coords, ...rest }: Props) {

  const lastCoord = coords[coords.length - 1];

  const mapRef = useRef<MapView>(null)

  async function onMapLoaded() {
    if(coords.length > 1) {
        mapRef.current?.fitToSuppliedMarkers(['user'], {edgePadding: {top: 50, right: 50, bottom: 50, left: 50}})
    }
  }

    return (
        <View w="full" h="full" borderWidth={2} borderColor="blue.500" borderRadius={10} overflow="hidden">
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                region={{
                    latitude: lastCoord.latitude,
                    longitude: lastCoord.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                }}
                onMapLoaded={onMapLoaded}
                {...rest}
            >
                <Marker
                    identifier="user"
                    coordinate={coords[0]}
                >
                    <VStack>
                        <Text textAlign="center" color="blue.600" fontSize="sm">
                            você
                        </Text>
                        <Icon
                            as={Entypo}
                            name="user"
                            size={8}
                            color="blue.600"
                        />
                    </VStack>
                </Marker>
            </MapView>
        </View>
    )
}
