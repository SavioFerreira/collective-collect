import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack, Icon } from 'native-base';

import { ColetaDTO } from '@dtos/ColetaDTO';
import { getGravityIcon, getStatusIcon, getTypeIcon } from '@utils/Icons';
import { FormatDate } from 'src/functions/FormatDate';

type Props = TouchableOpacityProps & {
  data: ColetaDTO;
};

export function ColetaCard({ data, ...rest }: Props) {

  const gravityIcon = getGravityIcon(data.gravity);
  const statusIcon = getStatusIcon(data.status);
  const typeIcon = getTypeIcon(data.type);
  const status = data.status.toLocaleLowerCase().replace("_", " ");
  const dateShow = FormatDate(data.date);

  return (
    <TouchableOpacity {...rest}>
      <VStack bg="darkBlue.700" alignItems="center" p={2} rounded="md" mb={3} borderWidth={1} borderColor={gravityIcon.color}>
        <HStack alignItems="center" px={4} rounded="md" mb={2}>
          <Icon
            as={typeIcon.Component}
            name={typeIcon.name}
            color={gravityIcon.color}
            size="lg"
            mt={2}
          />
          <VStack flex={1}>
            <Heading alignSelf="center" fontSize="lg" fontFamily="heading" color={gravityIcon.color} numberOfLines={1}>
              {data.title}
            </Heading>
            <Text alignSelf="center" fontSize="sm" fontFamily="body" color={statusIcon.color} numberOfLines={1}>
              {status.replace(status.charAt(0), status.charAt(0).toLocaleUpperCase())}
            </Text>

          </VStack>

          <Icon
            as={gravityIcon.Component}
            name={gravityIcon.name}
            color={gravityIcon.color}
            size="lg"
            mt={2}
          />
        </HStack>
        <HStack justifyContent="space-between" width="100%" px={2}>
          <Text fontSize="xs" fontFamily="body" color={statusIcon.color} numberOfLines={1}>
            Visualisar coleta
          </Text>
          <Text fontSize="xs" fontFamily="body" color={statusIcon.color} numberOfLines={1}>
            {dateShow}
          </Text>
        </HStack>
      </VStack>

    </TouchableOpacity>
  );
}