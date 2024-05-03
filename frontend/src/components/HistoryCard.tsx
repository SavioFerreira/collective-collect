import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack, Icon, Center } from 'native-base';

import { Entypo } from '@expo/vector-icons';

import CoopHomeSvg from '@assets/cooperation.svg';
import WastehomeSvg from '@assets/wasteHome.svg';


export function HistoryCard() {

  const ICON_HEIGHT = 50;

  const ICON_WIDTH = 45;
  return (
    <VStack px={5} mr={5} ml={5} borderRadius="lg" bg="blue.500" >
      <Text color="white" alignSelf="center"fontFamily="heading" fontSize="lg" mb={2} >
        Jornada
      </Text>

      <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
        <HStack bg="darkBlue.300" alignItems="center" p={2} pr={4} rounded="md" mb={3}>
          <WastehomeSvg
            width={ICON_WIDTH}
            height={ICON_HEIGHT}
          />
          <VStack flex={1}>
            <Text fontSize="md" ml={3} fontFamily="body" color="white">
              Denuncias realizadas
            </Text>
          </VStack>

          <Text fontSize="md" fontFamily="heading" color="white" mt={1} mr={2} numberOfLines={1}>
            {0}
          </Text>

          <Icon
            as={Entypo}
            name="chevron-thin-right"
            color="white"
            size="md"
            mt={1}
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
        <HStack bg="darkBlue.300" alignItems="center" p={2} pr={4} rounded="md" mb={3}>
          <CoopHomeSvg
            width={ICON_WIDTH}
            height={ICON_HEIGHT}
          />
          <VStack flex={1}>
            <Text fontSize="md" ml={3} fontFamily="body" color="white">
              Coletas realizadas
            </Text>
          </VStack>

          <Text fontSize="md" fontFamily="heading" color="white" mt={1} mr={2} numberOfLines={1}>
            {0}
          </Text>

          <Icon
            as={Entypo}
            name="chevron-thin-right"
            color="white"
            size="md"
            mt={1}
          />
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
}