import { TouchableOpacity } from "react-native";
import { HStack, Heading, Text, VStack, Icon, Pressable } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from "@hooks/useAuth";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import AvatarSvg from '@assets/avatar.svg';
import { SafeAreaView } from "react-native-safe-area-context";

export function HomeHeader() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenProfile() {
    navigation.navigate('profile');
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'rgb(74, 167, 255)' }}>
      <HStack bg="darkBlue.300" pb={2} px={8} alignItems="center">

        <Pressable
          _pressed={{ bg: "darkBlue.200" }}
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

          <Heading color="white" fontSize="lg" fontFamily="heading" maxW="85%" minW="85%" numberOfLines={2}>
            {user.name.replace(user.name.charAt(0), user.name.charAt(0).toLocaleUpperCase())}
          </Heading>
        </VStack>

        <TouchableOpacity onPress={signOut}>
          <Icon
            as={MaterialIcons}
            name="logout"
            color="darkBlue.700"
            size={9}
            mt={3}
          />
        </TouchableOpacity>
      </HStack>
    </SafeAreaView>
  )
}