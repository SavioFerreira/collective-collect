import { Platform } from 'react-native';
import { Icon, useTheme } from 'native-base';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import HomeSvg from '@assets/home.svg';
import ColetaSvg from '@assets/garrafa.svg';
import DenunciaSvg from '@assets/handsworld.svg';

import { Home } from '@screens/Home';
import { Denuncia } from '@screens/Denuncia';
import { Coleta } from '@screens/Coleta';
import { Profile } from '@screens/Profile';


type AppRoutes = {
  home: undefined;
  coleta: undefined;
  denuncia: undefined;
  profile: undefined;
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
          tabBarIcon: ({color}) => (
            <HomeSvg 
              fill={color} 
              width={iconSize} 
              height={iconSize}
            />
          )
        }}
      />

      <Screen 
        name='coleta'
        component={Coleta}
        options={{
          tabBarIcon: ({color}) => (
            <ColetaSvg 
              fill={color} 
              width={iconSize} 
              height={iconSize}
            />
          )
        }}
      />

      <Screen 
        name='denuncia'
        component={Denuncia}
        options={{
          tabBarIcon: ({color}) => (
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
        options={{tabBarButton: () => null}}
      />
    </Navigator>
  );
}