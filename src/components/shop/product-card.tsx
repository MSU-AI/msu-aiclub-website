'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { useToast } from '~/components/ui/use-toast';
import ShopifyClient from '~/utils/shopify';
import { ShopifyProduct } from '~/types/products';

interface ProductCardProps {
  product: ShopifyProduct;
  viewMode: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Find an available variant to use as the default
  const availableVariant = product.variants.find(v => v.availableForSale) || product.variants[0];
  const isAvailable = product.availableForSale && availableVariant?.availableForSale;
  const isOnSale = availableVariant?.compareAtPrice && 
                  parseFloat(availableVariant.compareAtPrice) > parseFloat(availableVariant.price);
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    // Stop event propagation to prevent navigation when clicking the "Add to cart" button
    e.stopPropagation();
    
    if (!availableVariant) {
      toast({
        title: "Error",
        description: "No available variant to add to cart",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      setIsAddingToCart(true);
      
      const shopifyClient = ShopifyClient.getInstance();
      await shopifyClient.addToCart(availableVariant.id, 1);
      
      // Dispatch cart updated event to refresh cart count
      const event = new CustomEvent('cart:updated');
      window.dispatchEvent(event);
      
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add to cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const navigateToProduct = () => {
    router.push(`/shop/${product.handle}`);
  };

  if (viewMode === 'grid') {
    return (
      <div 
        className="group flex flex-col rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={navigateToProduct}
      >
        <div className="relative w-full h-[300px] overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].src}
              alt={product.images[0].altText || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={true}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          
          {!isAvailable ? (
            <Badge variant="outline" className="absolute top-2 right-2 bg-background/80">
              Sold Out
            </Badge>
          ) : isOnSale ? (
            <Badge variant="destructive" className="absolute top-2 right-2">
              SALE
            </Badge>
          ) : null}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium line-clamp-1">{product.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1 flex-grow">
            {product.description}
          </p>
          
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="font-bold">${parseFloat(availableVariant?.price || '0').toFixed(2)}</span>
              {isOnSale && availableVariant?.compareAtPrice && (
                <span className="text-muted-foreground line-through ml-2">
                  ${parseFloat(availableVariant.compareAtPrice).toFixed(2)}
                </span>
              )}
            </div>
            
            <div>
              <Button 
                size="sm" 
                onClick={handleAddToCart} 
                disabled={!isAvailable || isAddingToCart}
              >
                {isAddingToCart ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-1.5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // List view
  return (
    <div 
      className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={navigateToProduct}
    >
      <div className="relative w-full sm:w-40 h-40 rounded-md overflow-hidden flex-shrink-0">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].altText || product.title}
            fill
            className="object-cover"
            priority={true}
            sizes="(max-width: 640px) 100vw, 160px"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{product.title}</h3>
          <div>
            <span className="font-bold">${parseFloat(availableVariant?.price || '0').toFixed(2)}</span>
            {isOnSale && availableVariant?.compareAtPrice && (
              <span className="text-muted-foreground line-through ml-2">
                ${parseFloat(availableVariant.compareAtPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mt-2 line-clamp-3 flex-grow">
          {product.description}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {product.tags?.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
            {!isAvailable && (
              <Badge variant="outline">Sold Out</Badge>
            )}
          </div>
          
          <Button 
            size="sm" 
            onClick={handleAddToCart} 
            disabled={!isAvailable || isAddingToCart}
          >
            {isAddingToCart ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
