'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '~/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '~/components/ui/select';
import { Badge } from '~/components/ui/badge';
import { ShoppingCart, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useToast } from '~/components/ui/use-toast';
import ShopifyClient from '~/utils/shopify';
import { ShopifyProduct } from '~/types/products';

interface ProductDetailProps {
  product: ShopifyProduct;
}

interface SizeChartRow {
  size: string;
  a: string; // Length
  b: string; // Width
  c: string; // Sleeve
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  // Find variants that are available for sale
  const availableVariants = product.variants.filter(v => v.availableForSale);
  
  // Set initial selected variant
  const [selectedVariantId, setSelectedVariantId] = useState(
    availableVariants.length > 0 ? availableVariants[0].id : product.variants[0]?.id
  );
  
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sizeChart, setSizeChart] = useState<SizeChartRow[]>([]);
  const { toast } = useToast();
  
  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  
  const isAvailable = selectedVariant?.availableForSale;
  const isOnSale = selectedVariant?.compareAtPrice && 
                  parseFloat(selectedVariant.compareAtPrice) > parseFloat(selectedVariant.price);
  
  // Extract size chart from description if available
  useEffect(() => {
    if (product.description) {
      // Look for size chart data in the description
      const sizeChartMatch = product.description.match(/Size guide(?:\s+)?([^]*?)(?:\s+)?(?:$|[A-Za-z]+ product sourced)/i);
      
      if (sizeChartMatch && sizeChartMatch[1]) {
        const sizeData = sizeChartMatch[1].trim();
        const rows: SizeChartRow[] = [];
        
        // Parse size chart data - looking for patterns like "S 68.6 96.5-104.1 85"
        const sizeRegex = /([A-Z0-9XL]+)\s+([0-9.]+)\s+([0-9.-]+)\s+([0-9.]+)/g;
        let match;
        
        while ((match = sizeRegex.exec(sizeData)) !== null) {
          rows.push({
            size: match[1],
            a: match[2],
            b: match[3],
            c: match[4]
          });
        }
        
        if (rows.length > 0) {
          setSizeChart(rows);
        }
      }
    }
  }, [product.description]);
  
  // Clean up description by removing size chart data
  const cleanDescription = product.description
    .replace(/Size guide(?:\s+)?([^]*?)(?:\s+)?(?:$|[A-Za-z]+ product sourced)/i, 'Product sourced')
    .replace(/A \(cm\) B \(cm\) C \(cm\)/i, '');
  
  const handleAddToCart = async () => {
    if (!selectedVariantId || !isAvailable) return;
    
    try {
      setIsAddingToCart(true);
      
      const shopifyClient = ShopifyClient.getInstance();
      await shopifyClient.addToCart(selectedVariantId, quantity);
      
      // Dispatch cart updated event
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

  return (
    <div className="max-w-screen-lg mx-auto pt-24 px-4 pb-16">
      <Link href="/shop" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Shop
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative w-full h-[400px] overflow-hidden rounded-lg border border-border">
            {product.images && product.images.length > 0 ? (
              <>
                <Image
                  src={product.images[activeImageIndex].src}
                  alt={product.images[activeImageIndex].altText || product.title}
                  fill
                  className="object-contain"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Mobile Navigation Arrows */}
                {product.images.length > 1 && (
                  <div className="md:hidden absolute inset-0 flex items-center justify-between p-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
                      }}
                      className="w-10 h-10 rounded-full bg-background/70 flex items-center justify-center text-foreground hover:bg-background/90"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
                      }}
                      className="w-10 h-10 rounded-full bg-background/70 flex items-center justify-center text-foreground hover:bg-background/90"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                )}
                
                {/* Image Counter for Mobile */}
                {product.images.length > 1 && (
                  <div className="md:hidden absolute bottom-2 left-0 right-0 flex justify-center">
                    <div className="bg-background/70 rounded-full px-3 py-1 text-xs">
                      {activeImageIndex + 1} / {product.images.length}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>
          
          {/* Desktop Thumbnails - Hidden on Mobile */}
          {product.images && product.images.length > 1 && (
            <div className="hidden md:grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  className={`relative h-20 w-20 overflow-hidden rounded border ${
                    index === activeImageIndex
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.altText || `${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${parseFloat(selectedVariant?.price ?? '0').toFixed(2)}
                </div>
                {isOnSale && selectedVariant?.compareAtPrice && (
                  <div className="text-muted-foreground line-through">
                    ${parseFloat(selectedVariant.compareAtPrice).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {product.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
              {!isAvailable && (
                <Badge variant="destructive">Sold Out</Badge>
              )}
              {isOnSale && (
                <Badge variant="destructive">Sale</Badge>
              )}
            </div>
          </div>
          
          <div className="text-muted-foreground">{cleanDescription}</div>
          
          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div className="space-y-3">
              <label className="font-medium">Size</label>
              <Select 
                value={selectedVariantId} 
                onValueChange={(value) => setSelectedVariantId(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant) => (
                    <SelectItem 
                      key={variant.id} 
                      value={variant.id}
                      disabled={!variant.availableForSale}
                    >
                      {variant.title}
                      {!variant.availableForSale && " (Sold Out)"}
                      {variant.compareAtPrice && ` - Sale $${parseFloat(variant.price).toFixed(2)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Quantity selector */}
          <div className="space-y-3">
            <label className="font-medium">Quantity</label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || !isAvailable}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!isAvailable}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to cart */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleAddToCart}
            disabled={!isAvailable || isAddingToCart}
          >
            {isAddingToCart ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
          
          {/* Additional info tabs */}
          <Tabs defaultValue="sizing" className="mt-8">
            <TabsList className="w-full">
              <TabsTrigger value="sizing" className="flex-1">Size Chart</TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
              <TabsTrigger value="returns" className="flex-1">Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="sizing" className="p-4 border rounded-md mt-2">
              <h3 className="font-medium mb-2">Size Chart</h3>
              {sizeChart.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Size</TableHead>
                        <TableHead>A - Length (cm)</TableHead>
                        <TableHead>B - Width (cm)</TableHead>
                        <TableHead>C - Sleeve (cm)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sizeChart.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.size}</TableCell>
                          <TableCell>{row.a}</TableCell>
                          <TableCell>{row.b}</TableCell>
                          <TableCell>{row.c}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No size chart available for this product.
                </p>
              )}
            </TabsContent>
            <TabsContent value="shipping" className="p-4 border rounded-md mt-2">
              <h3 className="font-medium mb-2">Shipping Information</h3>
              <p className="text-sm text-muted-foreground">
                Orders typically ship within 3-5 business days. Standard shipping within the United States 
                takes 3-5 business days after shipping.
              </p>
            </TabsContent>
            <TabsContent value="returns" className="p-4 border rounded-md mt-2">
              <h3 className="font-medium mb-2">Return Policy</h3>
              <p className="text-sm text-muted-foreground">
                We currently do not accept returns. We are working on accepting returns in the future.  
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
