import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

import { AppRoutes } from './app.routes';
import { useTheme } from 'native-base';
import { ValidaColeta } from '@screens/ValidaColeta';
import { ValidaDenuncia } from '@screens/ValidaDenuncia';

const { Navigator, Screen } = createDrawerNavigator();

export default function AdmRoutes() {
    const { sizes, colors } = useTheme();
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen
                name='admin'
                component={AppRoutes}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='sliders' color={color} size={size} />,
                    drawerLabel: 'Administrador'
                }}
            />

            <Screen
                name='validaColeta'
                component={ValidaColeta}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='tool' color={color} size={size} />,
                    drawerLabel: 'Validação Coleta'
                }}
            />

            <Screen
                name='validaDenuncia'
                component={ValidaDenuncia}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='tool' color={color} size={size} />,
                    drawerLabel: 'Validação Denuncia'
                }}
            />
        </Navigator>
    )
}