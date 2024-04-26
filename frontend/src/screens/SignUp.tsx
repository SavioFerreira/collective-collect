import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast, View } from "native-base";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';
import CrieSuaContaSvg from '@assets/crieSuaConta.svg';

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.').min(4, 'O usuário não pode ter menos de 4 caracteres'),
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'A senha deve ser a mesma')
});

export function SignUp() {
  const [isLoading, setIsloading] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  const navigation = useNavigation();
  const toast = useToast();
  const { singIn } = useAuth();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsloading(true);
       await api.post('/auth/register', {name, email, password} );

       toast.show({
        title: `Obrigado, ${name}. Conta criada com sucesso.`,
        placement: 'top',
        bgColor: 'green.600',
      });

      await singIn(email, password);

    } catch(error) {
      setIsloading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.';

      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1}  pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center mt={16} mb={8}>
          <LogoSvg />
          <Text color="blueGray.600" fontSize="lg">
            Colabore com sua vizinhança
          </Text>
        </Center>

        <VStack borderRadius="xl"  m={6} mt={1} px={4} py={4} backgroundColor={'rgba(255, 245, 245, 0.3)'}>
        <Center>
          <View mb={3}>
            <CrieSuaContaSvg />
          </View>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
                bgColor={'darkBlue.800'}
                opacity={75}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
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
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
                bgColor={'darkBlue.800'}
                opacity={75}
              />
            )}
          />
          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar a Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_confirm?.message}
                bgColor={'darkBlue.800'}
                opacity={75}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
              />
            )}
          />
          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>
        </VStack>

        <Center mt={5} px={10} pb={16}>
          <Button
            title="Voltar para o login"
            variant="outline"
            borderColor="white"
            borderRadius={12}
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}