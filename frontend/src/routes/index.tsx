import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { AuthRoutes } from './auth.routes';
import { useAuth } from '@hooks/useAuth';
import { AppRoutes } from './app.routes';
import { Loading } from '@components/Loading';
import AdmRoutes from './adm.routes';
import { RoleType } from 'src/enums/RoleTypesEnum';

export function Routes() {
  const { colors } = useTheme();
  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.darkBlue[200];

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  const isAdmin = user.role === RoleType.ADMIN;
  const isAuthenticated = user.id;
  return (
    <Box flex={1} bg="blue.300">
      <NavigationContainer theme={theme}>
        {isAuthenticated ? (
          isAdmin ? <AdmRoutes /> : <AppRoutes />
        ) : (
          <AuthRoutes />
        )}
      </NavigationContainer>
    </Box>
  );
}