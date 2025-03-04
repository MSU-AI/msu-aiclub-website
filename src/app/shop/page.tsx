'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Grid2X2, 
  List 
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';
import ProductCard from '~/components/shop/product-card';
import ShopifyClient from '~/utils/shopify';
import { ShopifyProduct } from '~/types/products';

export default function ShopPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch shop data (products)
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const shopifyClient = ShopifyClient.getInstance();
        
        try {
          const productsData = await shopifyClient.fetchAllProducts();
          setProducts(productsData || []);
        } catch (productError) {
          console.error('Error fetching products:', productError);
          setError('Failed to fetch products. Please try again later.');
        }
      } catch (error) {
        console.error('Error in fetchShopData:', error);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    return product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="max-w-screen-lg mx-auto pt-24 px-4 pb-16">
      <h1 className="text-4xl font-bold mb-4">AI Club Shop</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        {/* Search and view controls */}
        <div className="w-full space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid2X2 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="rounded-lg overflow-hidden border border-border">
              <Skeleton className="h-64 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-muted-foreground mt-2">
            {products.length > 0 
              ? "Try adjusting your search criteria" 
              : "No products are available in the store yet"}
          </p>
          
          {error && (
            <div className="mt-4 p-4 border border-red-300 rounded mx-auto max-w-md">
              <p className="text-red-500">{error}</p>
              <p className="text-sm mt-2">Please try refreshing the page</p>
            </div>
          )}
        </div>
      ) : (
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'flex flex-col gap-4'
          }
        `}>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
