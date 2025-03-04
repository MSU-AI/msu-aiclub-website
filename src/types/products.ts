export interface ShopifyProductImage {
  id: string;
  src: string;
  altText: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: string;
  currencyCode?: string;
  compareAtPrice: string | null;
  availableForSale: boolean;
  image: ShopifyProductImage | null;
  product?: {
    id: string;
    handle: string;
  };
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  images: ShopifyProductImage[];
  variants: ShopifyProductVariant[];
  collections?: { id: string }[];
}

export interface ShopifyCartItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: string;
    image: ShopifyProductImage | null;
    product?: {
      id: string;
      handle: string;
    }
  }
}

export interface ShopifyCart {
  id: string;
  webUrl: string;
  subtotalPrice: string;
  totalPrice: string;
  currencyCode: string;
  lineItems: ShopifyCartItem[];
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyProductImage | null;
}
