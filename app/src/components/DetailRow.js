import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function DetailRow({ label, value, isLast }) {
  return (
    <View style={[styles.row, !isLast && styles.divider]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.muted, fontSize: 14, flex: 1 },
  value: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'right' },
});
