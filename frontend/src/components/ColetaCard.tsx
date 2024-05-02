import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack, Icon } from 'native-base';

import { ColetaDTO } from '@dtos/ColetaDTO';
import { getGravityIcon, getStatusIcon, getTypeIcon } from '@utils/Icons';

type Props = TouchableOpacityProps & {
  data: ColetaDTO;
};

export function ColetaCard({ data, ...rest }: Props) {

  const gravityIcon = getGravityIcon(data.gravity);
  const statusIcon = getStatusIcon(data.status);
  const typeIcon = getTypeIcon(data.type);

  const status = data.status.toLocaleLowerCase().replace("_",  " ");

  return (
    <TouchableOpacity {...rest}>
      <HStack bg="darkBlue.700" alignItems="center" p={4} pr={4} rounded="md" mb={3} borderWidth={1} borderColor={gravityIcon.color}>
        <Icon
          as={typeIcon.Component}
          name={typeIcon.name}
          color={gravityIcon.color}
          size="lg"
          mt={6}
        />
        <VStack flex={1}>
          <Heading mb={2} alignSelf="center" fontSize="lg" fontFamily="heading" color={gravityIcon.color}  numberOfLines={1}>
            {data.title}
          </Heading>

          <Text  alignSelf="center" fontSize="sm" fontFamily="body" color={statusIcon.color} numberOfLines={1}>
            {status.replace(status.charAt(0), status.charAt(0).toLocaleUpperCase())}
          </Text>
        </VStack>

        <Icon
          as={gravityIcon.Component}
          name={gravityIcon.name}
          color={gravityIcon.color}
          size="lg"
          mt={6}
        />
      </HStack>
    </TouchableOpacity>
  );
}