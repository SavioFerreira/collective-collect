import React, { useEffect, useState } from 'react';
import { HStack, Heading, Icon, VStack, Text, Image, Box, ScrollView, useToast, Pressable, View, Flex, } from 'native-base';
import { TouchableOpacity, RefreshControl } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import RecicleLogoAdminSvg from '@assets/logoAdmin.svg';
import { getGravityIcon, getStatusIcon } from 'src/functions/Icons';
import { Loading } from '@components/Loading';
import { FormatDate } from 'src/functions/FormatDate';
import { DenunciaDTO } from '@dtos/DenunciaDTO';

type RouteParamsProps = {
  complaintId: string;
}


export function ComplaintDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [complaint, setComplaint] = useState<DenunciaDTO>({} as DenunciaDTO);

  const toast = useToast();
  const route = useRoute();
  const gravityIcon = getGravityIcon(complaint.gravity);
  const statusIcon = getStatusIcon(complaint.status ?? '');
  const statusTitle = complaint.status != undefined ? complaint.status.toLocaleLowerCase().replace("_", " ") : " ";
  const gravityTitle = complaint.gravity != undefined ? complaint.gravity.toLocaleLowerCase().replace("_", " ") : " ";
  const showComplaintDate = complaint.complaintDate != undefined || null ? FormatDate(complaint.complaintDate) : "Data não disponível";

  const { complaintId } = route.params as RouteParamsProps

  function handleViewComplaintOnMap(complaintId: string) {
    navigation.navigate('denuncias', { complaintId });
  }

  function handleGoBack() {
    navigation.goBack;
  }

  async function fetchComplaintDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/complaint/${complaintId}`);
      setComplaint(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes da denúncia';

      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
      handleGoBack();

    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }

  useEffect(() => {
    fetchComplaintDetails();
  }, [complaint.id]);

  return (
    <VStack flex={1}>
      <VStack px={5} bg="darkBlue.300" pt={10} pb={1}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="orange.700" size={12} pt={1} />
        </TouchableOpacity>

        <HStack justifyContent="space-evenly" alignItems="center">
          <HStack alignItems="center">
            <Heading color="coolGray.600" fontSize="xl" fontFamily="heading" numberOfLines={1} ml={10} mr={10}>
              Denúncia nº{complaint.id}
            </Heading>
            <HStack alignItems="center" >
              <RecicleLogoAdminSvg height={45} width={45} />
            </HStack>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? <Loading /> :
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchComplaintDetails}
          />
        }>
          <VStack p={4} pt={3}>

            <Box rounded="lg" mb={3} overflow="hidden">
              <Box bg="coolGray.600" mt={2} pt={1} pb={2} px={4} borderRadius="lg" borderBottomRadius={0} mb={1}>
                <Text fontFamily="heading" fontSize="md" color="yellow.400" mb={2} alignSelf="center">
                  Titulo da Denuncia
                </Text>
                <Text minH={3} maxH={16} fontStyle="italic" lineHeight={18} numberOfLines={3} color="warmGray.100" fontSize="md" textAlign="justify" alignSelf="center">
                  {complaint.title}
                </Text>
              </Box>
              <Box bg="coolGray.600" mb={1} pt={1} pb={1} px={0}>
                <HStack justifyContent="space-around">
                  <HStack>
                    <Text color="white" mr={2} alignSelf="center" fontSize="xs">
                      Gravidade
                    </Text>
                    <Icon
                      as={gravityIcon.Component}
                      name={gravityIcon.name}
                      color={gravityIcon.color}
                      size="xl"
                    />
                    <Text color={gravityIcon.color} ml={2} alignSelf="center" fontSize="xs">
                      {gravityTitle.replace(gravityTitle.charAt(0), gravityTitle.charAt(0).toLocaleUpperCase())}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text color="white" mr={2} alignSelf="center" fontSize="xs">
                      Status
                    </Text>
                    <Icon
                      as={statusIcon.Component}
                      name={statusIcon.name}
                      color={statusIcon.color}
                      size="lg"
                    />
                    <Text color={statusIcon.color} ml={2} alignSelf="center" fontSize="xs">
                      {statusTitle.replace(statusTitle.charAt(0), statusTitle.charAt(0).toLocaleUpperCase())}
                    </Text>
                  </HStack>
                </HStack>
              </Box>
              <Box position="relative" mb={1}
                minH={80}
                maxH={80}
                minW="full"
                maxW="full">
                {isLoading ? <Loading /> :
                  <Image
                    w="full"
                    h={80}
                    source={{ uri: `${complaint.image}` || "'https://www.cbde.org.br/images/default.jpg'" }}
                    alt="imagem da coleta"
                    resizeMode="cover"
                    borderWidth={2}
                    borderColor="coolGray.600"
                  />
                }
                <Box position="absolute" bottom={0} left={0} p={3} bgColor="rgba(7, 33, 51, 0.5)" w="full">
                  <HStack alignItems="center">

                    <Pressable
                      _pressed={{
                        opacity: 60
                      }}
                      onPress={() => handleViewComplaintOnMap(complaint.id?.toString() ?? '')}
                    >
                      <Icon
                        as={FontAwesome6}
                        name={"map-location-dot"}
                        color="orange.500"
                        size={12}
                        mr={2}
                      />
                    </Pressable>
                    <Text color="yellow.200" fontStyle="italic" ml={1} numberOfLines={2} maxW={'80%'}>
                      Local: {complaint.locale?.address ?? 'endereço indisponível'}
                    </Text>
                  </HStack>
                </Box>
              </Box>
              <Box bg="coolGray.600" mb={1} pt={2} pb={2} px={4} rounded="lg" borderTopRadius={0}>

                <Text fontFamily="heading" fontSize="md" color="yellow.400" mb={1}>
                  Descrição:
                </Text>
                <Text minH={10} maxH={20} fontStyle="italic" lineHeight={18} numberOfLines={4} color="warmGray.100" fontSize="md" textAlign="justify">
                  {complaint.description}
                </Text>
                <HStack justifyContent="space-between" mt={1}>
                  <Text fontFamily="body" fontSize="xs" color="yellow.400">
                    {showComplaintDate}
                  </Text>
                  <Text fontFamily="body" fontSize="xs" color="yellow.400">
                    Denuncia nº {complaint.id}
                  </Text>
                </HStack>
              </Box>
            </Box>

            <View>
            </View>
          </VStack>
        </ScrollView>
      }
    </VStack>
  )
}