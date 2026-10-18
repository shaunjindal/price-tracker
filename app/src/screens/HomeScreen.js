import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import ChipRow from '../components/ChipRow';
import ProductGrid from '../components/ProductGrid';
import useCategories from '../hooks/useCategories';
import useProducts from '../hooks/useProducts';
import useDebounce from '../hooks/useDebounce';
import { colors, spacing } from '../theme';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null);

  const { categories } = useCategories();
  const debouncedQuery = useDebounce(query);
  const { products, loading, error, retry } = useProducts({
    q: debouncedQuery.trim(),
    category: categoryId,
    subcategory: subcategoryId,
  });

  const subcategories = categories.find((c) => c.id === categoryId)?.subcategories ?? [];

  const selectCategory = (id) => {
    setCategoryId(id);
    setSubcategoryId(null); // reset subcategory when category changes
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Catalogue</Text>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      <ChipRow items={categories} selectedId={categoryId} onSelect={selectCategory} />
      {subcategories.length > 0 && (
        <View style={styles.subRow}>
          <ChipRow
            items={subcategories}
            selectedId={subcategoryId}
            onSelect={setSubcategoryId}
            allLabel="All types"
          />
        </View>
      )}

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={retry}
        onProductPress={(product) => navigation.navigate('Detail', { product })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.md, gap: spacing.md },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subRow: { marginTop: spacing.sm },
});
