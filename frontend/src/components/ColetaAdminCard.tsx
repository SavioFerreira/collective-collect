import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack, Icon } from 'native-base';

import { getGravityIcon, getStatusIcon, getTypeIcon } from 'src/functions/Icons';
import { ColetaDTO } from '@dtos/ColetaDTO';

type Props = TouchableOpacityProps & {
  data: ColetaDTO;
};

export function ColetaAdminCard({ data, ...rest }: Props) {

  const status = data.status?.toLocaleLowerCase().replace("_", " ");
  const typeIcon = getTypeIcon(data.type);
  const statusIcon = getStatusIcon(data.status ?? 'Status indisponível');
  const gravityIcon = getGravityIcon(data.gravity);

  return (
    <TouchableOpacity {...rest}>
      <VStack bg="darkBlue.800" alignItems="center" rounded="md" mb={1}>
        <HStack alignItems="center" px={6} rounded="md" mb={1}>
          <Icon
            as={typeIcon.Component}
            name={typeIcon.name}
            color={gravityIcon.color}
            size="lg"
            mt={1}
          />
          <VStack flex={1}>
            <Heading alignSelf="center" fontSize="md" fontFamily="heading" color={gravityIcon.color} numberOfLines={1} mt={1}>
              {data.title} - id: {data.id}
            </Heading>
            <Text alignSelf="center" fontSize="sm" fontFamily="body" color={statusIcon.color} numberOfLines={1}>
              {status?.replace(status.charAt(0), status.charAt(0).toLocaleUpperCase())}
            </Text>
          </VStack>
          <Icon
            as={gravityIcon.Component}
            name={gravityIcon.name}
            color={gravityIcon.color}
            size="lg"
            mt={1}
          />
        </HStack>
      </VStack>

    </TouchableOpacity>
  );
}