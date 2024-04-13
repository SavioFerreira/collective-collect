import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';

export default function Routes(){
    const {colors} = useTheme();

    const theme =  DefaultTheme;
    theme.colors.background = colors.darkBlue[200];
    return (
    <Box flex={1} bg="darkBlues">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
    )
}