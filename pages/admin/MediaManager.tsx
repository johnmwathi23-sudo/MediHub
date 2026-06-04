import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { Button } from '../../components/ui/Button';
import { Upload, Star, Trash, X, Save, ImageIcon, Check } from 'lucide-react';

export const MediaManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load products' });
    }
    setLoading(false);
  };

  const openEditor = (product: Product) => {
    setEditingProduct(product);
    setImages(product.images && product.images.length > 0 ? [...product.images] : [product.image || '']);
    setPrimaryImage(product.image || '');
    setMessage(null);
  };

  const closeEditor = () => {
    setEditingProduct(null);
    setImages([]);
    setPrimaryImage('');
    setMessage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readers: Promise<string>[] = [];
    Array.from(files).forEach(file => {
      readers.push(new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }));
    });

    Promise.all(readers).then(newImages => {
      setImages(prev => {
        const updated = [...prev, ...newImages];
        if (!primaryImage) setPrimaryImage(newImages[0]);
        return updated;
      });
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index] === primaryImage) {
        setPrimaryImage(updated.length > 0 ? updated[0] : '');
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    setSaving(true);
    setMessage(null);

    const finalImage = primaryImage || images[0] || '';
    const finalImages = images.length > 0 ? images : [finalImage];

    try {
      await api.products.update(editingProduct.id, {
        image: finalImage,
        images: finalImages,
      });
      setMessage({ type: 'success', text: 'Images updated successfully' });
      loadProducts();
    } catch {
      setMessage({ type: 'error', text: 'Failed to save images' });
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Manager</h1>
        {editingProduct && (
          <div className="flex space-x-2">
            <Button onClick={handleSave} isLoading={saving}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button variant="outline" onClick={closeEditor}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        )}
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-md text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />}
            {message.text}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading products...</div>
      ) : (
        <>
          {editingProduct && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">{editingProduct.name}</h2>
              <p className="text-sm text-gray-500 mb-4">Manage images for this product</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                      img === primaryImage ? 'border-medical-500 ring-2 ring-medical-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />

                    {img === primaryImage && (
                      <div className="absolute top-1 left-1 bg-medical-500 text-white p-1 rounded-full shadow-sm">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2 transition-opacity">
                      {img !== primaryImage && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(img)}
                          className="text-white hover:text-yellow-300 p-1"
                          title="Set as Primary"
                        >
                          <Star className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="text-white hover:text-red-300 p-1"
                        title="Remove Image"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                <label className="border-2 border-gray-300 border-dashed rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-50">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="mt-1 text-xs font-medium text-gray-500">Add Images</span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => openEditor(product)}
                  className={`group bg-white rounded-lg shadow-sm border-2 overflow-hidden text-left transition-all hover:shadow-md ${
                    editingProduct?.id === product.id ? 'border-medical-500' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.images && product.images.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        +{product.images.length - 1}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 bg-medical-600 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-all">
                        Edit Images
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-900 truncate leading-tight">{product.name}</p>
                    <div className="flex items-center mt-1 space-x-2 text-[10px] text-gray-400">
                      <ImageIcon className="h-3 w-3" />
                      <span>{product.images?.length || 1} images</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
