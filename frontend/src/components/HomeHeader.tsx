import { TouchableOpacity } from "react-native";
import { HStack, Heading, Text, VStack, Icon, Pressable } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import AvatarSvg from '@assets/avatar.svg';

export function HomeHeader(){

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenProfile() {
    navigation.navigate('profile');
  }

  return (
    <HStack bg="darkBlue.300" pt={12} pb={2} px={8} alignItems="center">

      <Pressable 
        _pressed={{bg: "darkBlue.200"}}
        size="20"
        borderWidth={2}
        borderColor={"darkBlue.700"}
        mr={4}
        rounded="full"
        alignItems="center"
        justifyContent="center"
        onPress={handleOpenProfile}
      >
        <AvatarSvg 
          width={55}
          height={55}
        />
      </Pressable>
      <VStack flex={1}>
        <Text color="white" fontSize="lg">
          Olá,
        </Text>

        <Heading color="white" fontSize="lg" fontFamily="heading">
          Sávio
        </Heading>
      </VStack>

      <TouchableOpacity  onPress={() => {}}>
        <Icon 
          as={MaterialIcons}
          name="logout"
          color="darkBlue.700"
          size={9}
          mt={3}
        /> 
      </TouchableOpacity>
    </HStack>
  )
}