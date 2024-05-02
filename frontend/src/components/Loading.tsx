import { Spinner, Center } from 'native-base';

export function Loading() {
    return (
        <Center 
          flex={1} 
          color={'green.500'} 
          bg={'darkBlue.200'}
        >
          <Spinner color="darkBlue.500" size={34} />
        </Center>

    );
}