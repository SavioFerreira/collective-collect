import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { AppRoutes } from './app.routes';
import { Center, HStack, Heading, Spacer, Text, VStack, useTheme } from 'native-base';
import { ValidaColeta } from '@screens/ValidaColeta';

import LogoCollectiveCollectSvg from '@assets/logo.svg';
import LogoRecicleSvg from '@assets/recycleLogo.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

type AdmRoutes = {
    cc: undefined;
    validaColeta: undefined;
}

const { Navigator, Screen } = createDrawerNavigator<AdmRoutes>();

export default function AdmRoutes() {
    const { colors } = useTheme();
    return (
        <Navigator
            initialRouteName='cc'
            drawerContent={props => {
                const { routeNames, index } = props.state;
                const focused = routeNames[index];
                return (
                <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkBlue[800], borderWidth: 2, borderColor: colors.green[400]}}>
                    <DrawerContentScrollView showsVerticalScrollIndicator={false} {...props} style={{ backgroundColor: colors.darkBlue[800]}}>
                        <HStack justifyContent="center">
                            <Text textAlign="center" fontSize="lg" fontFamily="heading" mb={3} mr={2} color={colors.green[400]}>
                                Admin control
                            </Text>
                            <LogoRecicleSvg />
                        </HStack>
                        <VStack mb='130%'>
                            <DrawerItem
                                label={'Coleta Coletiva'}
                                onPress={() => { props.navigation.navigate('cc') }}
                                icon={({ color, size }) => <Feather name='sliders' color={color} size={size} />}
                                focused={focused === 'cc'}
                                activeBackgroundColor={colors.darkBlue[700]}
                                inactiveBackgroundColor={colors.darkBlue[200]}
                                inactiveTintColor={colors.green[700]}
                                activeTintColor={colors.green[500]}
                            />
                            <DrawerItem
                                label={'Validar Coletas'}
                                onPress={() => { props.navigation.navigate('validaColeta') }}
                                icon={({ color, size }) => <Feather name='tool' color={color} size={size} />}
                                focused={focused === 'validaColeta'}
                                activeBackgroundColor={colors.darkBlue[700]}
                                inactiveBackgroundColor={colors.darkBlue[200]}
                                inactiveTintColor={colors.green[700]}
                                activeTintColor={colors.green[500]}
                            />
                        </VStack>
                        <Center>
                            <LogoCollectiveCollectSvg
                                width={190}
                                height={190}
                            />
                        </Center>

                    </DrawerContentScrollView>
                </SafeAreaView>
                );
            }}
            screenOptions={{
                headerShown: false,
                drawerPosition: 'left',
                drawerType: 'front',
            }}
        >
            <Screen name='cc' component={AppRoutes} />
            <Screen name='validaColeta' component={ValidaColeta} />
        </Navigator>
    );
}