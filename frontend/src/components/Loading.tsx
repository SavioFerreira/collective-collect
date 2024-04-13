import { Spinner, Center } from 'native-base';

export function Loading() {
    return (
        <Center 
          flex={1} 
          color={'green.50'} 
          bg={'gray.700'}
        >
          <Spinner />
        </Center>

    );
}