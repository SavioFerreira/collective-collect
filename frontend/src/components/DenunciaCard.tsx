import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack, Icon } from 'native-base';

import { DenunciaDTO } from "@dtos/DenunciaDTO"
import { getGravityIcon, getStatusIcon, getTypeIcon } from 'src/functions/Icons';
import { FormatDate } from 'src/functions/FormatDate';


type Props = TouchableOpacityProps & {
  data: DenunciaDTO;
};

export function DenunciaCard({ data, ...rest }: Props) {

  const status = data.status?.toLocaleLowerCase().replace("_", " ");
  const showDate = data.complaintDate != undefined || null ? FormatDate(data.complaintDate) : "Data indisponível";
  const author = data.author.id != undefined || null ? data.author.id : "Autor indisponível";
  const typeIcon = getTypeIcon(data.type);
  const statusIcon = getStatusIcon(data.status ?? 'Status indisponível');
  const gravityIcon = getGravityIcon(data.gravity);

  return (
    <TouchableOpacity {...rest}>
      <VStack bg="coolGray.700" alignItems="center" p={1} rounded="md" mb={3} borderWidth={1} borderColor={gravityIcon.color}>
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
        <HStack justifyContent="space-between" width="100%" px={2}>
          <Text fontSize="xs" fontFamily="body" color={statusIcon.color} numberOfLines={1}>
            Autor nº {author}
          </Text>
          <Text fontSize="xs" fontFamily="body" color={statusIcon.color} numberOfLines={1}>
             Data: {showDate}
          </Text>
        </HStack>
      </VStack>

    </TouchableOpacity>
  );
}