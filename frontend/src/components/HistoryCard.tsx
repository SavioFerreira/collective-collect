import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack, Icon, Center } from 'native-base';

import { Entypo } from '@expo/vector-icons';

import CoopHomeSvg from '@assets/cooperation.svg';
import WastehomeSvg from '@assets/wasteHome.svg';


export function HistoryCard() {

  const ICON_HEIGHT = 50;

  const ICON_WIDTH = 45;
  return (
    <VStack px={5} m={5} borderRadius="lg" bg="blue.400" >
      <HStack pt={5} pb={0} justifyContent="space-around">
        <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
          <Icon
            as={Entypo}
            name="help-with-circle"
            color="green.700"
            size={8}
            mb={10}
          />
        </TouchableOpacity>
        <Heading color="darkBlue.700" alignSelf="center" >
          Jornada
        </Heading>
        <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
          <Icon
            as={Entypo}
            name="info-with-circle"
            color="green.700"
            size={8}
            mb={3}
          />
        </TouchableOpacity>
      </HStack>

      <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
        <HStack bg="darkBlue.200" alignItems="center" p={2} pr={4} rounded="md" mb={3}>
          <WastehomeSvg
            width={ICON_WIDTH}
            height={ICON_HEIGHT}
          />
          <VStack flex={1}>
            <Text fontSize="md" ml={3} fontFamily="body" color="white">
              Denuncias realizadas
            </Text>
          </VStack>

          <Text fontSize="md" fontFamily="heading" color="green.700" mt={1} mr={2} numberOfLines={1}>
            {2}
          </Text>

          <Icon
            as={Entypo}
            name="chevron-thin-right"
            color="darkBlue.500"
            size="md"
            mt={1}
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={.7} onPress={() => { }}>
        <HStack bg="darkBlue.200" alignItems="center" p={2} pr={4} rounded="md" mb={3}>
          <CoopHomeSvg
            width={ICON_WIDTH}
            height={ICON_HEIGHT}
          />
          <VStack flex={1}>
            <Text fontSize="md" ml={3} fontFamily="body" color="white">
              Coletas realizadas
            </Text>
          </VStack>

          <Text fontSize="md" fontFamily="heading" color="green.700" mt={1} mr={2} numberOfLines={1}>
            {3}
          </Text>

          <Icon
            as={Entypo}
            name="chevron-thin-right"
            color="darkBlue.500"
            size="md"
            mt={1}
          />
        </HStack>
      </TouchableOpacity>
    </VStack>
  );
}