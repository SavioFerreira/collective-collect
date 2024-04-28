import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { useAuth } from '@hooks/useAuth';
import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';
import { Loading } from '@components/Loading';
import { AuthContextProvider } from '@contexts/AuthContext';

export  function Routes(){
    const {colors} = useTheme();
    const { user } = useAuth(); 

    console.log("buceta ---> " + user)

    const theme =  DefaultTheme;
    theme.colors.background = colors.darkBlue[200];

   
    return (
    <Box flex={1} bg="darkBlues">
      <NavigationContainer theme={theme}>

        <AuthContextProvider>
         {user.id ? <AppRoutes />  : <AuthRoutes />}
        </AuthContextProvider>
        
      </NavigationContainer>
    </Box>
    )
}