import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack, Icon, useToast } from 'native-base';

import { ColetaDTO } from '@dtos/ColetaDTO';
import { getGravityIcon, getStatusIcon, getTypeIcon } from '@utils/Icons';
import { FormatDate } from 'src/functions/FormatDate';
import { useState } from 'react';
import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

type Props = TouchableOpacityProps & {
  data: ColetaDTO;
};

export function ColetaCard({ data, ...rest }: Props) {

  const [coleta, setColeta] = useState<ColetaDTO>({} as ColetaDTO); 
  const gravityIcon = getGravityIcon(data.gravity);
  const statusIcon = getStatusIcon(data.status);
  const typeIcon = getTypeIcon(data.type);
  const status = data.status.toLocaleLowerCase().replace("_", " ");
  const showDate = data.collectDate != undefined || null ? FormatDate(data.collectDate): "Agenda pendente";
  const toast = useToast();
  
  async function fetchColetaDetails() {
    try {
      //setIsLoading(true);
      const response = await api.get(`/api/collect/${data.id}`);
      setColeta(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercícios';

      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
     // setIsLoading(false);
    }
  }

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
            {showDate}
          </Text>
        </HStack>
      </VStack>

    </TouchableOpacity>
  );
}