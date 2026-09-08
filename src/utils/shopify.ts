export class ShopifyClient {
  private static instance: ShopifyClient;
  private storeDomain: string;
  private storefrontToken: string;
  private apiVersion: string;
  private cartId: string | null = null;
  private localStorageKey = 'msu_ai_club_cart_id';

  private constructor() {
    this.storeDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN ?? 'shop.msuaiclub.com';
    this.storefrontToken = process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN ?? '';
    this.apiVersion = '2024-10';
    // Try to load an existing cart from localStorage
    this.loadCart();
  }

  public static getInstance(): ShopifyClient {
    if (!ShopifyClient.instance) {
      ShopifyClient.instance = new ShopifyClient();
    }
    return ShopifyClient.instance;
  }

  private loadCart() {
    if (typeof window !== 'undefined') {
      this.cartId = localStorage.getItem(this.localStorageKey);
    }
  }

  private saveCart(id: string) {
    this.cartId = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.localStorageKey, id);
    }
  }

  private clearCart() {
    this.cartId = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.localStorageKey);
    }
  }

  private async fetchStorefront(query: string, variables = {}) {
    try {
      const endpoint = `https://${this.storeDomain}/api/${this.apiVersion}/graphql.json`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.storefrontToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        console.error('Debug - fetchStorefront: Response not OK', {
          status: response.status,
          statusText: response.statusText
        });

        let errorText = '';
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'Could not get error text';
        }

        throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error('Debug - fetchStorefront: GraphQL errors', result.errors);
        throw new Error(`GraphQL Error: ${result.errors.map((e: any) => e.message).join(', ')}`);
      }

      return result;
    } catch (error) {
      console.error('Debug - fetchStorefront: Error', error);
      throw error;
    }
  }

  // Shared fragment used by every Cart mutation/query response so the
  // formatted shape returned to the UI stays consistent everywhere.
  private cartFragment = `
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    discountCodes {
      code
      applicable
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              image {
                id
                url
                altText
              }
              product {
                id
                handle
                title
              }
            }
          }
        }
      }
    }
  `;

  // Reshape a raw Cart object (from the Storefront API) into the flat
  // shape the rest of the app (ShopCart, ProductCard) already expects.
  private formatCart(cart: any) {
    const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
    const total = parseFloat(cart.cost.totalAmount.amount);
    const discountAmount = subtotal > total ? (subtotal - total).toFixed(2) : '0.00';

    const discountCodes = (cart.discountCodes || [])
      .filter((d: any) => d.applicable)
      .map((d: any) => ({
        code: d.code,
        amount: discountAmount,
        formattedValue: `Discount applied to order`,
      }));

    return {
      id: cart.id,
      webUrl: cart.checkoutUrl,
      subtotalPrice: cart.cost.subtotalAmount.amount,
      totalPrice: cart.cost.totalAmount.amount,
      currencyCode: cart.cost.subtotalAmount.currencyCode,
      discountCodes,
      lineItems: cart.lines.edges.map((edge: any) => {
        const line = edge.node;
        const variant = line.merchandise;
        return {
          id: line.id,
          title: variant?.product?.title || variant?.title || 'Item',
          quantity: line.quantity,
          discounts: [],
          variant: {
            id: variant?.id,
            title: variant?.title,
            price: variant?.price?.amount,
            image: variant?.image ? {
              id: variant.image.id,
              src: variant.image.url,
              altText: variant.image.altText
            } : null,
            product: {
              id: variant?.product?.id,
              handle: variant?.product?.handle
            }
          }
        };
      })
    };
  }

  // Fetch all products from the store
  public async fetchAllProducts() {
    try {
      const result = await this.fetchStorefront(`
        query GetProducts {
          products(first: 100) {
            edges {
              node {
                id
                title
                handle
                description
                availableForSale
                tags
                images(first: 5) {
                  edges {
                    node {
                      id
                      url
                      altText
                    }
                  }
                }
                variants(first: 100) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      availableForSale
                      image {
                        id
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `);

      if (!result.data || !result.data.products || !result.data.products.edges) {
        console.error('Debug - fetchAllProducts: Invalid response structure');
        return [];
      }

      const products = result.data.products.edges.map((edge: any) => {
        const product = edge.node;

        return {
          id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.description || '',
          availableForSale: product.availableForSale,
          tags: product.tags || [],
          images: product.images.edges.map((imgEdge: any) => {
            return {
              id: imgEdge.node.id,
              src: imgEdge.node.url,
              altText: imgEdge.node.altText || product.title
            };
          }),
          variants: product.variants.edges.map((varEdge: any) => {
            const variant = varEdge.node;
            return {
              id: variant.id,
              title: variant.title,
              price: variant.price.amount,
              currencyCode: variant.price.currencyCode,
              compareAtPrice: variant.compareAtPrice ? variant.compareAtPrice.amount : null,
              availableForSale: variant.availableForSale,
              image: variant.image ? {
                id: variant.image.id,
                src: variant.image.url,
                altText: variant.image.altText || product.title
              } : null
            };
          })
        };
      });

      return products;
    } catch (error) {
      console.error('Debug - Error in fetchAllProducts:', error);
      throw error;
    }
  }

  // Fetch a specific product by handle (slug)
  public async fetchProductByHandle(handle: string) {
    try {
      const result = await this.fetchStorefront(
        `
          query GetProduct($handle: String!) {
            product(handle: $handle) {
              id
              title
              handle
              description
              availableForSale
              tags
              images(first: 10) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    image {
                      id
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        `,
        { handle }
      );

      if (!result.data || !result.data.product) {
        throw new Error(`Product with handle '${handle}' not found`);
      }

      const product = result.data.product;
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description || '',
        availableForSale: product.availableForSale,
        tags: product.tags || [],
        images: product.images.edges.map((imgEdge: any) => ({
          id: imgEdge.node.id,
          src: imgEdge.node.url,
          altText: imgEdge.node.altText || product.title
        })),
        variants: product.variants.edges.map((varEdge: any) => {
          const variant = varEdge.node;
          return {
            id: variant.id,
            title: variant.title,
            price: variant.price.amount,
            currencyCode: variant.price.currencyCode,
            compareAtPrice: variant.compareAtPrice ? variant.compareAtPrice.amount : null,
            availableForSale: variant.availableForSale,
            image: variant.image ? {
              id: variant.image.id,
              src: variant.image.url,
              altText: variant.image.altText || product.title
            } : null
          };
        })
      };
    } catch (error) {
      console.error(`Debug - Error in fetchProductByHandle:`, error);
      throw error;
    }
  }

  // Fetch all collections
  public async fetchCollections() {
    try {
      const result = await this.fetchStorefront(`
        query GetCollections {
          collections(first: 50) {
            edges {
              node {
                id
                title
                handle
                description
                image {
                  id
                  url
                  altText
                }
              }
            }
          }
        }
      `);

      if (!result.data || !result.data.collections || !result.data.collections.edges) {
        return [];
      }

      const collections = result.data.collections.edges.map((edge: any) => {
        const collection = edge.node;
        return {
          id: collection.id,
          title: collection.title,
          handle: collection.handle,
          description: collection.description || '',
          image: collection.image ? {
            id: collection.image.id,
            src: collection.image.url,
            altText: collection.image.altText || collection.title
          } : null
        };
      });

      return collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }

  // Create a new cart
  public async createCart() {
    try {
      const result = await this.fetchStorefront(
        `
          mutation CreateCart {
            cartCreate(input: {}) {
              cart {
                ${this.cartFragment}
              }
              userErrors {
                field
                message
              }
            }
          }
        `
      );

      if (result.data.cartCreate.userErrors && result.data.cartCreate.userErrors.length > 0) {
        throw new Error(result.data.cartCreate.userErrors[0].message);
      }

      const cart = result.data.cartCreate.cart;
      this.saveCart(cart.id);

      return this.formatCart(cart);
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  // Get the current cart, creating one if none exists (or the saved one is stale)
  public async getCart() {
    try {
      if (!this.cartId) {
        return await this.createCart();
      }

      const result = await this.fetchStorefront(
        `
          query GetCart($id: ID!) {
            cart(id: $id) {
              ${this.cartFragment}
            }
          }
        `,
        { id: this.cartId }
      );

      // If the cart is missing/expired (e.g. old checkout ID from before
      // migration, or a completed/purged cart), create a fresh one.
      if (!result.data.cart) {
        this.clearCart();
        return await this.createCart();
      }

      return this.formatCart(result.data.cart);
    } catch (error) {
      console.error('Error getting cart:', error);
      this.clearCart();
      return await this.createCart();
    }
  }

  // Add an item to the cart
  public async addToCart(variantId: string, quantity: number) {
    try {
      if (!this.cartId) {
        await this.createCart();
      }

      const result = await this.fetchStorefront(
        `
          mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                ${this.cartFragment}
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
          cartId: this.cartId,
          lines: [{ merchandiseId: variantId, quantity }]
        }
      );

      if (result.data.cartLinesAdd.userErrors && result.data.cartLinesAdd.userErrors.length > 0) {
        throw new Error(result.data.cartLinesAdd.userErrors[0].message);
      }

      return this.formatCart(result.data.cartLinesAdd.cart);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  // Update cart item quantity
  public async updateCartItem(lineItemId: string, quantity: number) {
    try {
      if (!this.cartId) {
        throw new Error('No cart found');
      }

      const result = await this.fetchStorefront(
        `
          mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
            cartLinesUpdate(cartId: $cartId, lines: $lines) {
              cart {
                ${this.cartFragment}
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
          cartId: this.cartId,
          lines: [{ id: lineItemId, quantity }]
        }
      );

      if (result.data.cartLinesUpdate.userErrors && result.data.cartLinesUpdate.userErrors.length > 0) {
        throw new Error(result.data.cartLinesUpdate.userErrors[0].message);
      }

      return this.formatCart(result.data.cartLinesUpdate.cart);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  public async removeCartItem(lineItemId: string) {
    try {
      if (!this.cartId) {
        throw new Error('No cart found');
      }

      const result = await this.fetchStorefront(
        `
          mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
              cart {
                ${this.cartFragment}
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
          cartId: this.cartId,
          lineIds: [lineItemId]
        }
      );

      if (result.data.cartLinesRemove.userErrors && result.data.cartLinesRemove.userErrors.length > 0) {
        throw new Error(result.data.cartLinesRemove.userErrors[0].message);
      }

      return this.formatCart(result.data.cartLinesRemove.cart);
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  }

  /**
   * Apply a discount code to the cart
   * @param discountCode The discount code to apply
   * @returns Success status and error message if applicable
   */
  public async applyDiscountCode(discountCode: string) {
    try {
      if (!this.cartId) {
        throw new Error('No cart found');
      }

      // Preserve any codes already on the cart, since cartDiscountCodesUpdate
      // replaces the full list rather than appending to it.
      const currentCart = await this.getCart();
      const existingCodes = currentCart.discountCodes.map((d: any) => d.code);
      const newCodes = Array.from(new Set([...existingCodes, discountCode]));

      const result = await this.fetchStorefront(
        `
          mutation ApplyDiscountCodes($cartId: ID!, $discountCodes: [String!]) {
            cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
              cart {
                ${this.cartFragment}
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
          cartId: this.cartId,
          discountCodes: newCodes
        }
      );

      if (result.data.cartDiscountCodesUpdate.userErrors &&
          result.data.cartDiscountCodesUpdate.userErrors.length > 0) {
        const error = result.data.cartDiscountCodesUpdate.userErrors[0];
        return {
          success: false,
          error: error.message || 'Failed to apply discount code'
        };
      }

      const updatedCart = result.data.cartDiscountCodesUpdate.cart;
      const appliedCode = (updatedCart.discountCodes || []).find(
        (d: any) => d.code.toLowerCase() === discountCode.toLowerCase()
      );

      if (!appliedCode || !appliedCode.applicable) {
        return {
          success: false,
          error: 'Discount code is not valid for the items in your cart'
        };
      }

      // Notify our server the code was applied, for tracking purposes.
      try {
        await fetch('/api/redemptions/track-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            discountCode,
            status: 'applied'
          })
        });
      } catch (trackingError) {
        console.error('Error tracking discount code application:', trackingError);
      }

      return { success: true };
    } catch (error) {
      console.error('Error applying discount code:', error);
      return {
        success: false,
        error: 'Failed to apply discount code. Please try again.'
      };
    }
  }

  /**
   * Remove a discount code from the cart
   * @returns Success status
   */
  public async removeDiscountCode() {
    try {
      if (!this.cartId) {
        throw new Error('No cart found');
      }

      // cartDiscountCodesUpdate replaces the whole list, so removing "a"
      // code (to match the old single-code UI) means clearing them all.
      const result = await this.fetchStorefront(
        `
          mutation RemoveDiscountCodes($cartId: ID!) {
            cartDiscountCodesUpdate(cartId: $cartId, discountCodes: []) {
              cart {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
          cartId: this.cartId
        }
      );

      if (result.data.cartDiscountCodesUpdate.userErrors &&
          result.data.cartDiscountCodesUpdate.userErrors.length > 0) {
        throw new Error(result.data.cartDiscountCodesUpdate.userErrors[0].message);
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing discount code:', error);
      throw error;
    }
  }

  // Get the number of items in the cart
  public async getCartItemCount() {
    try {
      const cart = await this.getCart();
      if (!cart.lineItems) return 0;

      return cart.lineItems.reduce((total: number, item: any) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return 0;
    }
  }

  // Proceed to checkout
  public async checkout() {
    try {
      const cart = await this.getCart();
      return cart.webUrl; // Cart API's checkoutUrl, returned as webUrl for compatibility
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }
}

export default ShopifyClient;