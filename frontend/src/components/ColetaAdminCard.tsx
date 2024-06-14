import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack, Icon } from 'native-base';

import { DenunciaDTO } from "@dtos/DenunciaDTO"
import { getGravityIcon, getStatusIcon, getTypeIcon } from 'src/functions/Icons';
import { FormatDate } from 'src/functions/FormatDate';
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
      <VStack bg="cyan.900" alignItems="center" rounded="md" mb={2}>
        <HStack alignItems="center" px={6} rounded="md" mb={2}>
          <Icon
            as={typeIcon.Component}
            name={typeIcon.name}
            color={gravityIcon.color}
            size="lg"
            mt={2}
          />
          <VStack flex={1}>
            <Heading alignSelf="center" fontSize="lg" fontFamily="heading" color={gravityIcon.color} numberOfLines={1} mt={1}>
              {data.title}
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
            mt={2}
          />
        </HStack>
      </VStack>

    </TouchableOpacity>
  );
}