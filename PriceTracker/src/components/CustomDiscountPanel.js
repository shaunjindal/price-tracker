import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { parsePercent } from '../utils/pricing';
import { colors, radius, spacing } from '../theme';

const QUICK = [5, 10, 15, 20, 25];

// Lets a worker type a percentage (or tap a quick chip) to see a custom price.
// `value` is the applied percent (or null). Parent owns the state.
export default function CustomDiscountPanel({ value, onApply, onReset }) {
  const [text, setText] = useState(value ? String(value) : '');
  const [error, setError] = useState('');

  const apply = (raw) => {
    const percent = parsePercent(raw);
    if (!percent) {
      setError('Enter a percentage between 1 and 100');
      return;
    }
    setError('');
    setText(String(percent));
    onApply(percent);
  };

  const reset = () => {
    setText('');
    setError('');
    onReset();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Custom discount</Text>
      <Text style={styles.hint}>Applied on the original price. Only visible on this screen.</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="e.g. 20"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            returnKeyType="done"
            onSubmitEditing={() => apply(text)}
            maxLength={5}
          />
          <Text style={styles.percent}>%</Text>
        </View>
        <TouchableOpacity style={styles.applyBtn} onPress={() => apply(text)} activeOpacity={0.85}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.chips}>
        {QUICK.map((p) => {
          const active = value === p;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => apply(String(p))}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{p}%</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {value ? (
        <TouchableOpacity onPress={reset} hitSlop={8}>
          <Text style={styles.reset}>Remove custom discount</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  hint: { fontSize: 12, color: colors.muted },
  inputRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, height: 44, color: colors.text, fontSize: 16 },
  percent: { color: colors.muted, fontSize: 16, fontWeight: '600' },
  applyBtn: {
    backgroundColor: colors.primary,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { color: '#fff', fontWeight: '700' },
  error: { color: colors.danger, fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  reset: { color: colors.danger, fontWeight: '600', fontSize: 13, marginTop: 2 },
});
