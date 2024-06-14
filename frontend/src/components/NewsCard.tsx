import { TouchableOpacity } from 'react-native';
import { Heading, HStack, VStack, Icon, Center, View } from 'native-base';

import { Entypo } from '@expo/vector-icons';
import NewsSvg from '@assets/news.svg';
import { IViewProps } from 'native-base/lib/typescript/components/basic/View/types';
import { HelpModal } from './HelpModal';

type Props = IViewProps;

const helpNewsDescription = "Nesse campo de novidades iremos postar as novidades atreladas ao desenvolvimento e crescimento do app.\n\n" +
  "Além disso, também vamos disponibilizar links de postagems, documentários e blogs sobre sustentabilidade e meio ambiente.";

export function NewsCard({...rest}: Props){
  return (
    <VStack  borderRadius="lg" bg="blue.500" {...rest}>
      <HStack pt={2} justifyContent="space-around">
        <HelpModal label="Quadro de Novidades"  description={helpNewsDescription}/>
        <Heading color="white" alignSelf="center" >
          Novidades!
        </Heading>
        <View m={3}></View>
      </HStack>
      <Center m={1} mb={2}>
        <NewsSvg
          height={100}
          width={200} />
      </Center>

    </VStack>
  );
}