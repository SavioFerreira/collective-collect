import { VStack, Image, View, Text } from "native-base";
import { IconHeader } from "./IconHeader";

import BackDenunciaImg from '@assets/mapBackGround.png';

type Props = {
    message: string;
}

export function MapPermission({message}: Props) {
    return (
        <VStack flex={1}>
            <IconHeader title="Denuncias" />
            <VStack flex={1} alignItems="center" justifyContent="center" mt={5} ml={5} mr={5}>
                <Image
                    source={BackDenunciaImg}
                    alt="map"
                    resizeMode="cover"
                    position="absolute"

                    width="100%"
                    height="100%"
                    borderWidth={2}
                    borderColor="darkBlue.500"
                    borderRadius="lg"

                />
            </VStack>
            <View px={5} m={6} bgColor="blue.500" rounded="lg">
                <Text textAlign="justify" fontFamily="heading" fontSize="md" color="white" mb={2} mt={2}>
                    {message}
                </Text>
            </View>
        </VStack>
    )
}
