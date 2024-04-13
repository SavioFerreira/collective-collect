import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null;
}
export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;
  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput 
        bg="white"
        h={'16'}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="white"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1.5,
          borderColor: "red.700"
        }}
        _focus={{
          bgColor: 'rgba(5, 29, 51, 0.979)',
          borderWidth: 2,
          borderColor: 'blue.700'
        }}
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: "red.700", fontSize: 'sm', fontFamily: 'heading'}}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}