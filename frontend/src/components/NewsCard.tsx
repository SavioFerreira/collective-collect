import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack, Icon, Center } from 'native-base';

import { Entypo } from '@expo/vector-icons';
import NewsSvg from '@assets/news.svg';

export function NewsCard() {
  return (
    <VStack px={5} m={5} borderRadius="lg" bg="emerald.500" >
      <HStack pt={2} justifyContent="space-around">
        <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
          <Icon
            as={Entypo}
            name="help-with-circle"
            color="green.800"
            size={8}
            mb={10}
          />
        </TouchableOpacity>
        <Heading color="white" alignSelf="center" >
          Novidades!
        </Heading>
        <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
          <Icon
            as={Entypo}
            name="info-with-circle"
            color="green.800"
            size={8}
            mb={3}
          />
        </TouchableOpacity>
      </HStack>
      <Center m={0}>
        <NewsSvg
          height={100}
          width={200} />
      </Center>

    </VStack>
  );
}