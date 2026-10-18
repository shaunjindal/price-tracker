import { useCallback, useEffect, useState } from 'react';
import { fetchCategories } from '../api/catalogApi';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setError(null);
    fetchCategories().then(setCategories).catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);
  return { categories, error, reload: load };
}
