import { get } from './client';

export const fetchCategories = () => get('/categories');

export const fetchProducts = ({ q, category, subcategory }) =>
  get('/products', { q, category, subcategory });
