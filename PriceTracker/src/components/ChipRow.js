import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

// Reusable horizontal filter chips. Used for both categories and subcategories.
// Tapping the selected chip again clears the selection ("All").
export default function ChipRow({ items, selectedId, onSelect, allLabel = 'All' }) {
  const data = [{ id: null, name: allLabel }, ...items];

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => String(item.id)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const active = (selectedId ?? null) === item.id;
        return (
          <TouchableOpacity
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(active ? null : item.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.text, active && styles.textActive]}>{item.name}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.md, gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.text, fontSize: 14 },
  textActive: { color: '#fff', fontWeight: '600' },
});
