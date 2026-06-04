import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { Button } from '../../components/ui/Button';
import { Edit, Trash, Plus, X, Upload, ImageIcon, Star, FileText, Check, Download } from 'lucide-react';
import { CATEGORIES } from '../../data/products';

// Helper for CSV Parsing
const CSV_PRODUCT_FIELDS = ['name', 'category', 'price', 'stock', 'shortDescription'] as const;
type ProductField = typeof CSV_PRODUCT_FIELDS[number];

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: CATEGORIES[0],
    price: 0,
    stock: 0,
    image: '',
    images: [],
    shortDescription: '',
    longDescription: '',
    specifications: {},
  });

  // CSV Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvData, setCsvData] = useState<{ headers: string[], rows: string[][] } | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<ProductField, number>>({
      name: -1, category: -1, price: -1, stock: -1, shortDescription: -1
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await api.products.getAll();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await api.products.delete(id);
      loadProducts();
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      // Ensure images array exists, fallback to single image if legacy
      const images = product.images && product.images.length > 0 ? product.images : [product.image];
      setFormData({ ...product, images });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        category: CATEGORIES[0],
        price: 0,
        stock: 0,
        image: '',
        images: [],
        shortDescription: '',
        longDescription: '',
        specifications: {},
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // --- Image Handling ---

  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const readers: Promise<string>[] = [];
      
      Array.from(files).forEach(file => {
          readers.push(new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
          }));
      });

      Promise.all(readers).then(newImages => {
          setFormData(prev => {
              const updatedImages = [...(prev.images || []), ...newImages];
              // If no primary image set, set the first one
              const primary = prev.image || updatedImages[0];
              return { ...prev, images: updatedImages, image: primary };
          });
      });
    }
  };

  const setPrimaryImage = (imgUrl: string) => {
      setFormData(prev => ({ ...prev, image: imgUrl }));
  };

  const removeImage = (indexToRemove: number) => {
      setFormData(prev => {
          const currentImages = prev.images || [];
          const updatedImages = currentImages.filter((_, idx) => idx !== indexToRemove);
          
          // If we deleted the primary image, reset it
          let newPrimary = prev.image;
          if (currentImages[indexToRemove] === prev.image) {
              newPrimary = updatedImages.length > 0 ? updatedImages[0] : '';
          }

          return { ...prev, images: updatedImages, image: newPrimary };
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate images
    const finalImage = formData.image || 'https://placehold.co/600x600/e0f2fe/0369a1?text=No+Image';
    const finalImages = formData.images && formData.images.length > 0 ? formData.images : [finalImage];

    const payload = {
        ...formData,
        image: finalImage,
        images: finalImages
    };

    if (editingId) {
      await api.products.update(editingId, payload);
    } else {
      await api.products.create({
          ...payload as any,
          slug: payload.name?.toLowerCase().replace(/ /g, '-') || 'new-product',
          rating: 0,
          reviews: 0
      });
    }
    handleCloseModal();
    loadProducts();
  };

  // --- CSV Handling ---

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
              const text = evt.target?.result as string;
              const rows = text.split('\n').map(r => r.trim()).filter(r => r);
              if (rows.length > 0) {
                  // Naive CSV split (doesn't handle commas in quotes)
                  const headers = rows[0].split(',').map(h => h.trim());
                  const dataRows = rows.slice(1).map(r => r.split(',').map(c => c.trim()));
                  
                  setCsvData({ headers, rows: dataRows });
                  
                  // Auto-guess mapping
                  const newMapping = { ...columnMapping };
                  headers.forEach((h, idx) => {
                      const lowerH = h.toLowerCase();
                      if (lowerH.includes('name') || lowerH.includes('title')) newMapping.name = idx;
                      else if (lowerH.includes('cat')) newMapping.category = idx;
                      else if (lowerH.includes('price') || lowerH.includes('cost')) newMapping.price = idx;
                      else if (lowerH.includes('stock') || lowerH.includes('qty')) newMapping.stock = idx;
                      else if (lowerH.includes('desc')) newMapping.shortDescription = idx;
                  });
                  setColumnMapping(newMapping);
                  setIsImportModalOpen(true);
              }
          };
          reader.readAsText(file);
      }
      // Reset input
      e.target.value = '';
  };

  const executeImport = async () => {
      if (!csvData) return;

      const newProducts = csvData.rows.map(row => {
          const name = columnMapping.name > -1 ? row[columnMapping.name] : 'Imported Product';
          const catRaw = columnMapping.category > -1 ? row[columnMapping.category] : 'Other';
          const category = CATEGORIES.includes(catRaw) ? catRaw : CATEGORIES[0];
          const price = columnMapping.price > -1 ? parseFloat(row[columnMapping.price]) || 0 : 0;
          const stock = columnMapping.stock > -1 ? parseInt(row[columnMapping.stock]) || 0 : 0;
          const shortDesc = columnMapping.shortDescription > -1 ? row[columnMapping.shortDescription] : '';

          return {
              name,
              category,
              price,
              stock,
              shortDescription: shortDesc,
              longDescription: shortDesc, // Fallback
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              image: 'https://placehold.co/600x600/e0f2fe/0369a1?text=Product',
              images: ['https://placehold.co/600x600/e0f2fe/0369a1?text=Product'],
              specifications: {},
              rating: 0,
              reviews: 0
          };
      });

      // Sequential creation to simulate API calls
      setLoading(true);
      for (const p of newProducts) {
          await api.products.create(p);
      }
      setLoading(false);
      setIsImportModalOpen(false);
      setCsvData(null);
      loadProducts();
      alert(`Successfully imported ${newProducts.length} products.`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <div className="flex space-x-2">
            <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <FileText className="h-4 w-4 mr-2" />
                Import CSV
                <input type="file" className="hidden" accept=".csv" onChange={handleCsvFile} />
            </label>
            <Button onClick={() => handleOpenModal()}>
                <Plus className="h-4 w-4 mr-2" /> Add New Product
            </Button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 relative group">
                       <img className="h-12 w-12 rounded-md object-cover" src={product.image} alt="" />
                       {product.images && product.images.length > 1 && (
                           <span className="absolute -top-1 -right-1 bg-medical-600 text-white text-[10px] px-1 rounded-full">+{product.images.length-1}</span>
                       )}
                    </div>
                    <div className="ml-4">
                       <p className="text-sm font-medium text-medical-600 truncate">{product.name}</p>
                       <p className="flex items-center text-sm text-gray-500">
                          Stock: <span className={`ml-1 font-bold ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>{product.stock}</span>
                       </p>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex space-x-2">
                   <button onClick={() => handleOpenModal(product)} className="text-gray-400 hover:text-medical-600">
                      <Edit className="h-5 w-5" />
                   </button>
                   <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600">
                      <Trash className="h-5 w-5" />
                   </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* --- CSV IMPORT MODAL --- */}
      {isImportModalOpen && csvData && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
             <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsImportModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Map CSV Columns</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 mb-4">
                                        We found {csvData.rows.length} rows. Please map the columns from your CSV to the product fields.
                                    </p>
                                    <div className="space-y-3">
                                        {CSV_PRODUCT_FIELDS.map(field => (
                                            <div key={field} className="flex items-center justify-between">
                                                <label className="block text-sm font-medium text-gray-700 capitalize w-1/3">
                                                    {field}
                                                </label>
                                                <select 
                                                    className="mt-1 block w-2/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm rounded-md border"
                                                    value={columnMapping[field]}
                                                    onChange={(e) => setColumnMapping(prev => ({ ...prev, [field]: parseInt(e.target.value) }))}
                                                >
                                                    <option value={-1}>-- Ignore --</option>
                                                    {csvData.headers.map((h, i) => (
                                                        <option key={i} value={i}>{h}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <Button onClick={executeImport} className="w-full sm:ml-3 sm:w-auto">
                            Import Products
                        </Button>
                        <Button variant="outline" onClick={() => setIsImportModalOpen(false)} className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
                            Cancel
                        </Button>
                    </div>
                </div>
             </div>
          </div>
      )}

      {/* --- ADD/EDIT PRODUCT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {editingId ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        
                        {/* Name */}
                        <div className="sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 focus:ring-medical-500 focus:border-medical-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                        </div>

                        {/* Category */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm">
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Price (KES)</label>
                            <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="mt-1 focus:ring-medical-500 focus:border-medical-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                        </div>

                        {/* Stock */}
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                            <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="mt-1 focus:ring-medical-500 focus:border-medical-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                        </div>

                         {/* Image Upload Gallery */}
                         <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                {(formData.images || []).map((img, idx) => (
                                    <div key={idx} className={`relative group aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 ${img === formData.image ? 'border-medical-500 ring-2 ring-medical-500 ring-offset-2' : 'border-gray-200'}`}>
                                        <img src={img} alt={`Product ${idx}`} className="w-full h-24 object-cover" />
                                        
                                        {/* Primary Indicator */}
                                        {img === formData.image && (
                                            <div className="absolute top-1 left-1 bg-medical-500 text-white p-1 rounded-full shadow-sm">
                                                <Star className="h-3 w-3 fill-current" />
                                            </div>
                                        )}

                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2 transition-opacity">
                                            {img !== formData.image && (
                                                <button type="button" onClick={() => setPrimaryImage(img)} className="text-white hover:text-medical-200" title="Make Primary">
                                                    <Star className="h-5 w-5" />
                                                </button>
                                            )}
                                            <button type="button" onClick={() => removeImage(idx)} className="text-white hover:text-red-300" title="Remove">
                                                <Trash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                <label className="border-2 border-gray-300 border-dashed rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 h-24">
                                    <Upload className="h-6 w-6 text-gray-400" />
                                    <span className="mt-2 text-xs font-medium text-gray-500">Add Images</span>
                                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleMultiImageUpload} />
                                </label>
                            </div>
                        </div>

                        {/* Short Description */}
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Short Description</label>
                            <input type="text" value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="mt-1 focus:ring-medical-500 focus:border-medical-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                        </div>

                        {/* Long Description */}
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Long Description</label>
                            <textarea rows={3} value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})} className="mt-1 focus:ring-medical-500 focus:border-medical-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                        </div>
                    </div>
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button type="submit" form="product-form" className="w-full sm:ml-3 sm:w-auto">
                    Save Product
                </Button>
                <Button variant="outline" onClick={handleCloseModal} className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
                    Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};