import { FlatList } from 'react-native';
import ProductCard from './ProductCard';
import StateView from './StateView';
import { spacing } from '../theme';

export default function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  onProductPress,
  bottomPadding = spacing.lg,
}) {
  if (loading) return <StateView type="loading" />;
  if (error) {
    return <StateView type="error" message={error} actionLabel="Retry" onAction={onRetry} />;
  }

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(p) => p.id}
      contentContainerStyle={{ padding: spacing.sm, paddingBottom: bottomPadding }}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => onProductPress(item)} />
      )}
      ListEmptyComponent={
        <StateView type="empty" message="No products found. Try another keyword or filter." />
      }
      keyboardShouldPersistTaps="handled"
    />
  );
}
