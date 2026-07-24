"use client"

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Product } from '../../../lib/products';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    image: '',
    glb: '',
    description: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({ id: '', name: '', price: '', image: '', glb: '', description: '' });
    setImageFile(null);
    setGlbFile(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      glb: product.glb || '',
      description: product.description || ''
    });
    setImageFile(null);
    setGlbFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      fetchProducts();
    } else {
      alert('Error deleting product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // For new product, generate ID from name if empty
    let productId = formData.id;
    if (!editingProduct && !productId) {
      productId = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    let imageUrl = formData.image;
    // Upload image if a new file is selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imageFile);
      if (uploadError) {
        alert(`Error uploading image: ${uploadError.message}`);
        setIsUploading(false);
        return;
      }
      imageUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
    }

    let glbUrl = formData.glb;
    // Upload GLB if a new file is selected
    if (glbFile) {
      const fileExt = glbFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, glbFile);
      if (uploadError) {
        alert(`Error uploading 3D model: ${uploadError.message}`);
        setIsUploading(false);
        return;
      }
      glbUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
    }

    const productPayload = {
      id: productId,
      name: formData.name,
      price: formData.price,
      image: imageUrl,
      glb: glbUrl || null,
      description: formData.description || null
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from('products').update(productPayload).eq('id', editingProduct.id));
    } else {
      ({ error } = await supabase.from('products').insert([productPayload]));
    }

    setIsUploading(false);

    if (error) {
      alert(`Error saving product: ${error.message}`);
    } else {
      setIsDialogOpen(false);
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900 leading-none mb-2">Products Inventory</h1>
          <p className="text-sm text-slate-500">Manage your product listings and pricing</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-slate-900 text-white rounded-full px-6 shadow-sm hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-white rounded-[2rem] p-6 shadow-xl border-0">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  {editingProduct && (
                    <div className="space-y-1.5">
                      <Label htmlFor="id" className="text-xs font-semibold text-slate-600">ID (Slug)</Label>
                      <Input id="id" name="id" value={formData.id} onChange={handleInputChange} readOnly className="bg-slate-50 text-slate-500 border-slate-200 rounded-xl" />
                    </div>
                  )}
                  {!editingProduct && (
                    <div className="space-y-1.5">
                      <Label htmlFor="id" className="text-xs font-semibold text-slate-600">ID (Optional - auto-generated)</Label>
                      <Input id="id" name="id" value={formData.id} onChange={handleInputChange} placeholder="custom-id" className="border-slate-200 rounded-xl focus-visible:ring-purple-200" />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-slate-600">Product Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Modern Sofa" className="border-slate-200 rounded-xl focus-visible:ring-purple-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="price" className="text-xs font-semibold text-slate-600">Price (Text)</Label>
                    <Input id="price" name="price" value={formData.price} onChange={handleInputChange} required placeholder="e.g. Rp 1.500.000" className="border-slate-200 rounded-xl focus-visible:ring-purple-200" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="imageFile" className="text-xs font-semibold text-slate-600">Upload Product Image</Label>
                    <Input 
                      type="file" 
                      id="imageFile" 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                          setFormData(prev => ({ ...prev, image: URL.createObjectURL(e.target.files![0]) }));
                        }
                      }} 
                      className="border-slate-200 rounded-xl focus-visible:ring-purple-200 text-xs file:bg-slate-50 file:text-slate-700 file:border-0 file:rounded-full file:px-3 file:py-1 file:mr-2 file:text-xs file:font-medium hover:file:bg-slate-100 cursor-pointer h-10" 
                    />
                    {!imageFile && formData.image && (
                      <p className="text-[10px] text-slate-400 mt-1 truncate">Current: {formData.image}</p>
                    )}
                  </div>
                  {/* Image Preview */}
                  <div className="h-32 w-full rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    ) : (
                      <span className="text-xs text-slate-400">No image preview</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="glbFile" className="text-xs font-semibold text-slate-600">Upload 3D Model (.glb) - Optional</Label>
                <Input 
                  type="file" 
                  id="glbFile" 
                  accept=".glb" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setGlbFile(e.target.files[0]);
                    }
                  }} 
                  className="border-slate-200 rounded-xl focus-visible:ring-purple-200 text-xs file:bg-slate-50 file:text-slate-700 file:border-0 file:rounded-full file:px-3 file:py-1 file:mr-2 file:text-xs file:font-medium hover:file:bg-slate-100 cursor-pointer h-10" 
                />
                {!glbFile && formData.glb && (
                  <p className="text-[10px] text-slate-400 mt-1 truncate">Current: {formData.glb}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-600">Description</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-200"
                  placeholder="Describe your product..." 
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isUploading} className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</Button>
                <Button type="submit" disabled={isUploading} className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                  {isUploading ? 'Uploading...' : (editingProduct ? 'Save Changes' : 'Create Product')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">All Products List</h2>
          <button className="text-slate-400 hover:text-slate-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-4 font-medium px-4">Product Name</th>
                <th className="pb-4 font-medium px-4">Status</th>
                <th className="pb-4 font-medium px-4">Price</th>
                <th className="pb-4 font-medium px-4">Customer Rating</th>
                <th className="pb-4 font-medium px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">No products found.</td>
                </tr>
              ) : (
                products.map((product, index) => {
                  // Mock logic for status and rating based on index
                  const isStockOk = index % 3 !== 0;
                  const rating = 4.5 + (index % 5) * 0.1;
                  
                  return (
                    <tr key={product.id} className="border-b border-slate-50/80 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center">
                            <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{product.name}</p>
                            <p className="text-[11px] text-slate-500">Furniture & Decor</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {isStockOk ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-pink-100 text-pink-600">Stock OK</span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#e9e1fa] text-[#7c3aed]">Reorder</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-700">
                        {product.price}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(rating) ? "#facc15" : "none"} stroke={i < Math.floor(rating) ? "#facc15" : "#cbd5e1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          ))}
                          <span className="text-xs text-slate-500 font-medium ml-1">({rating.toFixed(1)})</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditDialog(product)} className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-full shadow-sm border border-slate-100 hover:border-slate-200 transition-all">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:text-red-600 bg-white rounded-full shadow-sm border border-slate-100 hover:border-slate-200 transition-all">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
