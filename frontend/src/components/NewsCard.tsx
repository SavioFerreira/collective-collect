import { TouchableOpacity } from 'react-native';
import { Heading, HStack, VStack, Icon, Center } from 'native-base';

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
        <TouchableOpacity activeOpacity={.7}>
          <Icon
            as={Entypo}
            name="info-with-circle"
            color="cyan.300"
            size={6}
            mb={3}
          />
        </TouchableOpacity>
      </HStack>
      <Center m={1} mb={2}>
        <NewsSvg
          height={100}
          width={200} />
      </Center>

    </VStack>
  );
}