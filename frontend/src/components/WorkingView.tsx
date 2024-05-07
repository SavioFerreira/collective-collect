import { View, Text, Heading, Center } from "native-base";
import { useState } from "react";

export function WorkingView() {
    const [isModalVisible, SetIsModalVisible] = useState(false);
    return (
        <View flex={1}>
            <Center>
                <Heading color='white'>
                    Olá mundo
                </Heading>
            </Center>
        </View>
    )
}