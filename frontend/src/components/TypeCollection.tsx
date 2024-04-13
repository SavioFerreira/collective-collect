import { useTheme, Pressable, IPressableProps, Text, View  } from 'native-base';
import { } from 'react-native';

const { colors } = useTheme();

const TYPE_COLORS = {
  EASY: colors.green[500],
  HARD: colors.red[500],
  MEDIUM: colors.orange[500],
}

type Props = IPressableProps & {
  title: string;
  isChecked?: boolean;
  type?: keyof typeof TYPE_COLORS;
}

export function TypeCollection({ title, type = 'EASY', isChecked = false, ...rest }: Props) {

  const COLOR = TYPE_COLORS[type];

  return (
    <Pressable {...rest}>
      <View style={
        [
          
          { borderColor: COLOR, backgroundColor: isChecked ? COLOR : 'transparent' }
        ]
      }>
        <Text style={
          [
            
            { color: isChecked ? colors.blue[300] : COLOR }
          ]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}