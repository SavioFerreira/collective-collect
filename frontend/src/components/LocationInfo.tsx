import { HStack, Icon, VStack, Text, View } from "native-base";
import {  FontAwesome6 } from '@expo/vector-icons';
import { IViewProps } from "native-base/lib/typescript/components/basic/View/types";

type Props = IViewProps  & {
    label: string;
    description: string;
}

export function LocationInfo({ label, description, ...rest }: Props) {
    return (
        <View alignItems="flex-start" {...rest}>
            <HStack>
                <Icon
                    textAlign="center"
                    alignSelf="center"
                    as={FontAwesome6}
                    name={"map-location-dot"}
                    color="blue.700"
                    size={7}
                    mr={2}

                />
                <VStack>
                    <Text numberOfLines={1} fontSize="sm" fontFamily="body" color="blue.700">
                        {label}
                    </Text>
                    <Text numberOfLines={1} fontSize="xs" fontFamily="heading" color="blue.700">
                        {description}
                    </Text>
                </VStack>
            </HStack>
        </View>
    )
}