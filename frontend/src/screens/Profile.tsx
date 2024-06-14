import { Center, ScrollView, VStack, Heading, Image, View, Pressable, Text } from 'native-base';

import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { IconHeader } from '@components/IconHeader';
import AvatarSvg from '@assets/avatar.svg';


export function Profile() {
  const oculta = false;
  return (
    <VStack flex={1}>
      <IconHeader title="Perfil" />
      <VStack>

        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Blue Sky"
          resizeMode="cover"
          position="absolute"
        />
        <ScrollView>
          <Center>
            <Pressable _pressed={{ opacity: 50 }} mt={10} borderWidth={2} borderColor="blue.400" p={4} bgColor="blue.300" rounded="full">
              <AvatarSvg width={100} height={100} />
            </Pressable>
          </Center>

          {oculta ?
            <VStack>
              <Center mt={6} px={10}>
                <Input
                  placeholder="Nome"
                  bg="blue.400"
                />
                <Input
                  bg="blue.400"
                  placeholder="E-mail"
                  isDisabled
                  readOnly
                />
              </Center>
              <VStack px={10} mt={12} mb={9}>
                <Heading color="darkBlue.500" fontSize="md" fontFamily="heading" mb={3}>
                  Alterar senha
                </Heading>
                <Input
                  bg="blue.400"
                  placeholder="Senha antiga"
                  secureTextEntry
                />
                <Input
                  bg="blue.400"
                  placeholder="nova senha"
                  secureTextEntry
                />
                <Input
                  bg="blue.400"
                  placeholder="Confirme a nova senha"
                  secureTextEntry
                />
                <Button title="Atualizar" mt={4} />
              </VStack>
            </VStack>
            :
            <View>
              <Text></Text>
            </View>
          }
        </ScrollView>
      </VStack>
    </VStack>
  )
}