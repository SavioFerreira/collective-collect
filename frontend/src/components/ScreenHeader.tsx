import { Center, Heading, VStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

type Props =  {
    title: string;
}

export function ScreenHeader({title}: Props) {
  return(
    <SafeAreaView style={{backgroundColor: 'rgb(74, 167, 255)'}}>
    <Center bg="darkBlue.300" pb={3}>
        <Heading color="white" fontSize="xl" fontFamily="heading">
            {title}
        </Heading>
    </Center>
    </SafeAreaView>
  );   
}