import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function SearchBar({ value, onChangeText, placeholder = 'Search products' }) {
  return (
    <View style={styles.box}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={10}>
          <Text style={styles.clear}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, height: 46, color: colors.text, fontSize: 15 },
  clear: { color: colors.muted, fontSize: 16, paddingLeft: spacing.sm },
});
