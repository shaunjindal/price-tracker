import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

// One component for loading / empty / error states.
export default function StateView({ type, message, actionLabel, onAction }) {
  if (type === 'loading') {
    return (
      <View style={styles.box}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.box}>
      <Text style={styles.emoji}>{type === 'error' ? '⚠️' : '🛏️'}</Text>
      <Text style={styles.text}>{message}</Text>
      {onAction ? (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', padding: spacing.lg * 2, gap: spacing.sm },
  emoji: { fontSize: 36 },
  text: { color: colors.muted, textAlign: 'center', fontSize: 14 },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
