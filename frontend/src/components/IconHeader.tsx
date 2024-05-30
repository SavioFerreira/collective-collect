import { TouchableOpacity } from "react-native";
import { HStack, Heading, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@hooks/useAuth";
import { RoleType } from "@enums/RoleTypesEnum";

import RecycleIconSvg from '@assets/recycleLogo.svg';
import RecycleIconAdminSvg from '@assets/logoAdmin.svg';

type Props = {
  title: string;
}

export function IconHeader({title}:Props){

  const {user} = useAuth();

  return (
    <SafeAreaView style={{backgroundColor: 'rgb(74, 167, 255)'}}>
    <HStack bg="darkBlue.300" px={5}  alignItems="center">
     
      <VStack flex={1}>
        <Heading color="white" fontSize="xl" fontFamily="heading">
         {title}
        </Heading>
      </VStack>

      <TouchableOpacity  onPress={() => {}}>
      { user.role === RoleType.ADMIN ?
        <RecycleIconAdminSvg height={50} width={50} />
        :
        <RecycleIconSvg height={50} width={50} />
      }
      </TouchableOpacity>
    </HStack>
    </SafeAreaView>
  )
}