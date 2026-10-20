import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '../api/catalogApi';

export default function useProducts({ q, category, subcategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false; // ignore stale responses
    setLoading(true);
    setError(null);
    fetchProducts({ q, category, subcategory })
      .then((data) => !cancelled && setProducts(data.items))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [q, category, subcategory, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { products, loading, error, retry };
}
