'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductDetail from '~/components/shop/product-detail';
import { Skeleton } from '~/components/ui/skeleton';
import ShopifyClient from '~/utils/shopify';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const handle = Array.isArray(params.handle) ? params.handle[0] : params.handle;
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle || typeof handle !== 'string') {
        setError('Invalid product handle');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching product with handle:', handle);
        
        const shopifyClient = ShopifyClient.getInstance();
        const productData = await shopifyClient.fetchProductByHandle(handle);
        
        console.log('Product data received:', productData ? 'Yes' : 'No');
        
        if (productData) {
          setProduct(productData);
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error loading product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  if (isLoading) {
    return (
      <div className="max-w-screen-lg mx-auto pt-24 px-4 pb-16">
        <div className="mb-8">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-lg mx-auto pt-24 px-4 pb-16">
        <Link href="/shop" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </Link>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-screen-lg mx-auto pt-24 px-4 pb-16">
        <Link href="/shop" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </Link>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
