import { Platform } from 'react-native';
import { useTheme } from 'native-base';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import HomeSvg from '@assets/home.svg';
import ColetaSvg from '@assets/garrafa.svg';
import DenunciaSvg from '@assets/handsworld.svg';

import { Home } from '@screens/Home';
import { HomeColeta } from '@screens/HomeColeta';
import { Profile } from '@screens/Profile';
import { Coleta } from '@screens/Coleta';
import { Denuncia } from '@screens/Denuncia';

type AppRoutes = {
  home: undefined;
  coletas: undefined;
  denuncias: {complaintId: string};
  profile: undefined;
  detalhesColeta: {collectId: string};
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();

  const iconSize = sizes[10];
  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: true,
      tabBarLabelStyle: { fontSize: 15, fontWeight: '600' },
      tabBarActiveTintColor: colors.blue[800],
      tabBarInactiveTintColor: colors.white,
      tabBarStyle: {
        backgroundColor: colors.darkBlue[300],
        borderTopWidth: 0,
        height: Platform.OS === 'android' ? 75 : 96,
        paddingBottom: sizes[1],
        paddingTop: sizes[2],
      }
    }} >

      <Screen
        name='home'
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg
              fill={color}
              width={iconSize}
              height={iconSize}
            />
          )
        }}
      />

      <Screen
        name='coletas'
        component={HomeColeta}
        options={{
          tabBarIcon: ({ color }) => (
            <ColetaSvg
              fill={color}
              width={iconSize}
              height={iconSize}
            />
          )
        }}
      />

      <Screen
        name='denuncias'
        component={Denuncia}
        options={{
          tabBarIcon: ({ color }) => (
            <DenunciaSvg
              fill={color}
              width={50}
              height={50}
            />
          )
        }}
      />

      <Screen
        name='profile'
        component={Profile}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name='detalhesColeta'
        component={Coleta}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}