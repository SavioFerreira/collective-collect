import { TouchableOpacity } from "react-native";
import { HStack, Heading, VStack } from "native-base";


import RecycleIconSvg from '@assets/recycleLogo.svg';
import { SafeAreaFrameContext, SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
}

export function IconHeader({title}:Props){

  return (
    <SafeAreaView style={{backgroundColor: 'rgb(74, 167, 255)'}}>
    <HStack bg="darkBlue.300" px={5}  alignItems="center">
     
      <VStack flex={1}>
        <Heading color="white" fontSize="xl" fontFamily="heading">
         {title}
        </Heading>
      </VStack>

      <TouchableOpacity  onPress={() => {}}>
      <RecycleIconSvg height={50} width={50} />
      </TouchableOpacity>
    </HStack>
    </SafeAreaView>
  )
}