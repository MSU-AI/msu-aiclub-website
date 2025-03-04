'use client';

import React, { ReactNode } from 'react';
import { CartProvider } from '@shopify/hydrogen-react';

interface ShopProviderProps {
  children: ReactNode;
}

const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  // Use environment variables for Shopify configuration
  const shopDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN ?? '';
  const storefrontToken = process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN ?? '';
  const countryCode = 'US';
  const languageCode = 'EN';

  return (
    <CartProvider
      countryCode={countryCode}
      languageCode={languageCode}
      storeDomain={`https://${shopDomain}`}
      storefrontToken={storefrontToken}
      storefrontApiVersion="2023-10"
    >
      {children}
    </CartProvider>
  );
};

export default ShopProvider;
