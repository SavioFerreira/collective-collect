import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Image, Text, VStack, Icon, Center } from 'native-base';

import { Entypo } from '@expo/vector-icons';

import { api } from '@services/api';
import { ColetaDTO } from '@dtos/ColetaDTO';

type Props = TouchableOpacityProps & {
  data: ColetaDTO;
};

export function ColetaCard({ data, ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack bg="darkBlue.200" alignItems="center" p={4} pr={4} rounded="md" mb={3}>
      <Icon 
          as={Entypo}
          name="game-controller"
          color="green.800"
          size="lg"
        />
        <VStack flex={1}>
          <Heading  alignSelf="center" fontSize="lg" fontWeight="thin" color="white">
            {data.title}
          </Heading>

          <Text  alignSelf="center" fontSize="sm" color="white" mt={1} numberOfLines={2}>
             {data.gravity}     x     {data.status}
          </Text>
        </VStack>

        <Icon 
          as={Entypo}
          name="chevron-thin-right"
          color="darkBlue.600"
          size="md"
        />
      </HStack>
    </TouchableOpacity>
  );
}