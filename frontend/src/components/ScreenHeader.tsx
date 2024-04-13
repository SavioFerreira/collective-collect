import { Center, Heading, VStack } from "native-base";

import ReclycleLogoSvg from '@assets/recycleCircle.svg';

type Props =  {
    title: string;
}



export function ScreenHeader({title}: Props) {
  return(
    <Center bg="darkBlue.300" pb={3} pt={12}>
        <Heading color="white" fontSize="xl" fontFamily="heading">
            {title}
        </Heading>
    </Center>
  );   
}