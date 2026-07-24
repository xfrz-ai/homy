import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  glb: string | null;
  description: string | null;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching products:', error?.message);
    return [];
  }

  return data as Product[];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching product by id:', error?.message);
    return null;
  }

  return data as Product;
}
