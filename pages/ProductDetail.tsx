import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { ShoppingCart, Check, Star, Shield, Info } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const data = await api.products.getById(id);
        setProduct(data || null);
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex justify-center items-center">Product not found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex mb-8 text-sm text-gray-500">
           <Link to="/" className="hover:text-medical-600">Home</Link>
           <span className="mx-2">/</span>
           <Link to="/shop" className="hover:text-medical-600">Shop</Link>
           <span className="mx-2">/</span>
           <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Image */}
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 mb-8 lg:mb-0">
             <img src={product.image} alt={product.name} className="w-full h-full object-center object-cover" />
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6">
               <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
               </div>
               <span className="ml-2 text-sm text-gray-500">{product.reviews} reviews</span>
            </div>

            <p className="text-3xl font-bold text-gray-900 mb-6">KES {product.price.toLocaleString()}</p>
            
            <div className="prose text-gray-700 mb-8">
               <p>{product.longDescription}</p>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-8">
               <h3 className="font-medium text-gray-900 mb-4">Specifications</h3>
               <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                     <div key={key} className="border-b border-gray-100 pb-2">
                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="text-sm text-gray-900 mt-1">{value}</dd>
                     </div>
                  ))}
               </dl>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <Button onClick={handleAddToCart} size="lg" className="flex-1" disabled={product.stock === 0}>
                  {added ? (
                      <>
                        <Check className="h-5 w-5 mr-2" /> Added to Cart
                      </>
                  ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </>
                  )}
               </Button>
            </div>

            <div className="flex items-start space-x-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
                <Shield className="h-5 w-5 text-medical-600 mt-0.5" />
                <p>1 Year Warranty included. Genuine parts guaranteed. Technical support available 24/7 for this product.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};