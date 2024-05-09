import { VStack, Image, Text, Center, ScrollView, useToast, View } from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png';
import AcesseSuaContaSvg from '@assets/acesseConta.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { useState } from 'react';

type FormData = {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.'),
});

export function SignIn() {
  const [isLoading, setIsloading] = useState(false);
  const { singIn, user } = useAuth();
  
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(signInSchema)
  });


  async function handleSignIn({ email, password }: FormData) {

    try {
      setIsloading(true);
      
      await singIn(email, password);

    } catch(error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível acessar sua conta. Tente novamente mais tarde.'

      setIsloading(false);
      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsHorizontalScrollIndicator={false}>
      <VStack flex={1} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="sky"
          resizeMode="cover"
          position="absolute"
        />
        <Center mt={16} mb={8}>
          <LogoSvg />
          <Text color="blueGray.600" fontSize="lg">
            Colabore com sua vizinhança
          </Text>

        </Center>
        <VStack borderRadius="xl" m={6} mt={1} px={4} py={4} backgroundColor={'rgba(255, 245, 245, 0.3)'}>
          <Center>
            <View mb={3}>
              <AcesseSuaContaSvg />
            </View>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                  bgColor={'darkBlue.800'}
                  opacity={75}
                />
              )}
            >
            </Controller>

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                  bgColor={'darkBlue.800'}
                  opacity={75}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  returnKeyType="send"
                />
              )}
            >
            </Controller>
            <Button title="Acessar"
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />
          </Center>
        </VStack>

        
        <Center mt={5} px={10}>
          <Text
            color="black"
            fontSize="xl" mb={2}
            fontFamily="heading"
          >
            Ainda não tem acesso?
          </Text>
          <Button
            title="Criar conta"
            variant="outline"
            borderColor="white"
            borderRadius={12}
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}