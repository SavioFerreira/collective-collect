import React, { useEffect, useRef, useState } from "react";
import MapView, { MapViewProps, PROVIDER_GOOGLE, LatLng, Marker } from "react-native-maps";
import { Icon, VStack, Text, View, useToast } from "native-base";
import { Entypo } from '@expo/vector-icons';
import { mapStyleAllBlue } from "@utils/mapStyle";
import { api } from "@services/api";
import { ColetaDTO } from "@dtos/ColetaDTO";
import { AppError } from "@utils/AppError";
import { getGravityIcon, getTypeIcon } from "src/functions/Icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { StatusEnum } from "@enums/StatusEnum";

import AvatarSvg from '@assets/avatar.svg';

type Props = MapViewProps & {
    coords: LatLng[];
};

type DenunciasRouteParams = {
    Denuncias: {
        complaintId?: string;
    };
};

export function Map({ coords, ...rest }: Props) {
    const lastCoord = coords[coords.length - 1];
    const mapRef = useRef<MapView | null>(null);
    const [coletas, setColetas] = useState<ColetaDTO[]>([]);
    const [mapStyle, setMapStyle] = useState();
    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const route = useRoute<RouteProp<DenunciasRouteParams, 'Denuncias'>>();
    const complaintId = route.params?.complaintId;

    const visibleCollect = coletas.filter(collect => collect.status !== StatusEnum.APROVADO);

    function handleOpenColetaDetails(collectId: string) {
        navigation.navigate('detalhesColeta', { collectId });
    }

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

    async function fetchColetas() {
        try {
            const response = await api.get('api/collect');
            setColetas(response.data);
        } catch (error) {
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
        fetchColetas();
    }, [complaintId]);

    useEffect(() => {
        if (complaintId && coletas.length > 0) {
            const targetComplaint = coletas.find(coleta => coleta.id.toString() === complaintId);
            if (targetComplaint) {
                const region = {
                    latitude: targetComplaint.locale.latitude,
                    longitude: targetComplaint.locale.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                };
                mapRef.current?.animateToRegion(region, 1000);
            }
        }
    }, [coletas, complaintId]);

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
                {visibleCollect.map((coleta, index) => {
                    const typeIcon = getTypeIcon(coleta.type);
                    const colorIcon = getGravityIcon(coleta.gravity);
                    return (
                        <Marker
                            key={index}
                            coordinate={{ latitude: coleta.locale.latitude ?? 0, longitude: coleta.locale.longitude ?? 0 }}
                            title={coleta.title}
                            description={` STATUS: ${coleta.status}`}
                            onPress={() => {
                                Alert.alert(
                                    "Ir para detalhes da coleta?",
                                    `Deseja ver mais informações sobre a coleta?`,
                                    [
                                        {
                                            text: "Não",
                                            style: "cancel"
                                        },
                                        {
                                            text: "Sim",
                                            onPress: () => handleOpenColetaDetails(coleta.id.toString())
                                        }
                                    ]
                                );
                            }}
                        >
                            <View rounded="full" p={1} bgColor={colorIcon.color} borderWidth={2} borderColor="green.500">
                                <Icon 
                                    as={typeIcon.Component}
                                    name={typeIcon.name}
                                    color="blue.600"
                                    m={1}
                                    size={7}
                                    textAlign="center"
                                />
                            </View>
                        </Marker>
                    );
                })}
                <Marker
                    title="Você"
                    identifier="user"
                    coordinate={coords[0]}
                >
                    <VStack>
                        <AvatarSvg width={40} height={40} />
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
            <VStack
                zIndex={1}
                position="absolute"
                right={2}
                bottom={2}
                bgColor='rgba(45, 2, 145, 0.137)'
                rounded="lg"
                p={1}
            >
                <Text color="blue.600" fontFamily="heading" fontSize="xs">
                    Atualizar
                </Text>
                <Icon
                    as={Entypo}
                    name="ccw"
                    size="9"
                    color="blue.600"
                    alignSelf="center"
                    onPress={() => fetchColetas()}
                />
            </VStack>
        </View>
    );
}
