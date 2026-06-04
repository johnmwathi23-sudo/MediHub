import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { CATEGORIES } from '../data/products';
import { Button } from '../components/ui/Button';
import { Filter, Star } from 'lucide-react';

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('cat');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || 'All');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await api.products.getAll();
      setProducts(data);
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category.includes(selectedCategory));
    }
    setFilteredProducts(result);
  }, [selectedCategory, products]);

  useEffect(() => {
      if(categoryFilter) {
          setSelectedCategory(categoryFilter);
      }
  }, [categoryFilter]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
        setSearchParams({});
    } else {
        setSearchParams({ cat });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Medical Equipment Store</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                 <Filter className="h-5 w-5 mr-2 text-gray-500" />
                 <h2 className="font-semibold text-gray-900">Categories</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => handleCategoryChange('All')}
                    className={`text-sm w-full text-left ${selectedCategory === 'All' ? 'text-medical-600 font-bold' : 'text-gray-600 hover:text-medical-600'}`}
                  >
                    All Products
                  </button>
                </li>
                {CATEGORIES.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => handleCategoryChange(cat)}
                      className={`text-sm w-full text-left ${selectedCategory === cat ? 'text-medical-600 font-bold' : 'text-gray-600 hover:text-medical-600'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-64 object-cover object-center bg-gray-100"
                      />
                    </Link>
                    <div className="p-4">
                      <p className="text-xs text-medical-600 mb-1">{product.category}</p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">{product.name}</h3>
                      </Link>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-bold text-gray-900">KES {product.price.toLocaleString()}</span>
                        <Link to={`/product/${product.id}`}>
                           <Button size="sm" variant="outline">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No products found in this category.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};