import { TouchableOpacity } from "react-native";
import { HStack, Heading, Text, VStack, Icon, Pressable } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import RecycleIconSvg from '@assets/recycleLogo.svg';

type Props = {
  title: string;
}

export function IconHeader({title}:Props){

  return (
    <HStack bg="darkBlue.300" pt={10} px={5}  alignItems="center">
      <VStack flex={1}>
        <Heading color="white" fontSize="xl" fontFamily="heading">
         {title}
        </Heading>
      </VStack>

      <TouchableOpacity  onPress={() => {}}>
      <RecycleIconSvg height={50} width={50} />
      </TouchableOpacity>
    </HStack>
  )
}