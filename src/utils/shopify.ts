export class ShopifyClient {
  private static instance: ShopifyClient;
  private storeDomain: string;
  private storefrontToken: string;
  private apiVersion: string;
  private checkoutId: string | null = null;
  private localStorageKey = 'msu_ai_club_checkout_id';

  private constructor() {
    
    this.storeDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN ?? 'shop.msuaiclub.com';
    this.storefrontToken = process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN ?? '';
    this.apiVersion = '2023-10';
    //
    // Try to load an existing checkout from localStorage
    this.loadCheckout();
  }

  public static getInstance(): ShopifyClient {
    if (!ShopifyClient.instance) {
      ShopifyClient.instance = new ShopifyClient();
    }
    return ShopifyClient.instance;
  }

  private loadCheckout() {
    if (typeof window !== 'undefined') {
      this.checkoutId = localStorage.getItem(this.localStorageKey);
    }
  }

  private saveCheckout(id: string) {
    this.checkoutId = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.localStorageKey, id);
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

  // Fetch all products from the store
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

    // Check if we have valid response data
    if (!result.data || !result.data.products || !result.data.products.edges) {
      console.error('Debug - fetchAllProducts: Invalid response structure');
      return [];
    }

    // Format the response to be more usable
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
            src: imgEdge.node.url, // Make sure this field exists in the response
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
              src: variant.image.url, // Make sure this field exists in the response
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

      // Format the response
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

  // Create a new checkout
  public async createCheckout() {
    try {
      const result = await this.fetchStorefront(`
        mutation CreateCheckout {
          checkoutCreate(input: {}) {
            checkout {
              id
              webUrl
            }
            checkoutUserErrors {
              code
              field
              message
            }
          }
        }
      `);

      if (result.data.checkoutCreate.checkoutUserErrors && 
          result.data.checkoutCreate.checkoutUserErrors.length > 0) {
        throw new Error(result.data.checkoutCreate.checkoutUserErrors[0].message);
      }

      const checkoutId = result.data.checkoutCreate.checkout.id;
      this.saveCheckout(checkoutId);
      
      return result.data.checkoutCreate.checkout;
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  }

  // Get the current cart/checkout
  public async getCart() {
    try {
      if (!this.checkoutId) {
        return await this.createCheckout();
      }

      const result = await this.fetchStorefront(
        `
          query GetCheckout($id: ID!) {
            node(id: $id) {
              ... on Checkout {
                id
                webUrl
                completedAt
                subtotalPrice {
                  amount
                  currencyCode
                }
                totalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 100) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      variant {
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
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        { id: this.checkoutId }
      );

      // If checkout is completed or doesn't exist, create a new one
      if (!result.data.node || result.data.node.completedAt) {
        return await this.createCheckout();
      }

      // Format the response
      const checkout = result.data.node;
      return {
        id: checkout.id,
        webUrl: checkout.webUrl,
        subtotalPrice: checkout.subtotalPrice.amount,
        totalPrice: checkout.totalPrice.amount,
        currencyCode: checkout.subtotalPrice.currencyCode,
        lineItems: checkout.lineItems.edges.map((edge: any) => {
          const item = edge.node;
          return {
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            variant: {
              id: item.variant.id,
              title: item.variant.title,
              price: item.variant.price.amount,
              image: item.variant.image ? {
                id: item.variant.image.id,
                src: item.variant.image.url,
                altText: item.variant.image.altText
              } : null,
              product: {
                id: item.variant.product.id,
                handle: item.variant.product.handle
              }
            }
          };
        })
      };
    } catch (error) {
      console.error('Error getting cart:', error);
      // If there's an error fetching the checkout, create a new one
      return await this.createCheckout();
    }
  }

  // Add an item to the cart
  public async addToCart(variantId: string, quantity: number) {
    try {
      // Ensure we have a checkout ID
      if (!this.checkoutId) {
        const checkout = await this.createCheckout();
        this.checkoutId = checkout.id;
      }

      const result = await this.fetchStorefront(
        `
          mutation AddItemToCheckout($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
            checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
              checkout {
                id
                webUrl
                subtotalPrice {
                  amount
                  currencyCode
                }
                totalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 100) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      variant {
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
                      }
                    }
                  }
                }
              }
              checkoutUserErrors {
                code
                field
                message
              }
            }
          }
        `,
        {
          checkoutId: this.checkoutId,
          lineItems: [{ variantId, quantity }]
        }
      );

      if (result.data.checkoutLineItemsAdd.checkoutUserErrors &&
          result.data.checkoutLineItemsAdd.checkoutUserErrors.length > 0) {
        throw new Error(result.data.checkoutLineItemsAdd.checkoutUserErrors[0].message);
      }

      // Format the response
      const checkout = result.data.checkoutLineItemsAdd.checkout;
      return {
        id: checkout.id,
        webUrl: checkout.webUrl,
        subtotalPrice: checkout.subtotalPrice.amount,
        totalPrice: checkout.totalPrice.amount,
        currencyCode: checkout.subtotalPrice.currencyCode,
        lineItems: checkout.lineItems.edges.map((edge: any) => {
          const item = edge.node;
          return {
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            variant: {
              id: item.variant.id,
              title: item.variant.title,
              price: item.variant.price.amount,
              image: item.variant.image ? {
                id: item.variant.image.id,
                src: item.variant.image.url,
                altText: item.variant.image.altText
              } : null
            }
          };
        })
      };
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  // Update cart item quantity
  public async updateCartItem(lineItemId: string, quantity: number) {
    try {
      if (!this.checkoutId) {
        throw new Error('No checkout found');
      }

      const result = await this.fetchStorefront(
        `
          mutation UpdateCheckoutItems($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
            checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
              checkout {
                id
                webUrl
                subtotalPrice {
                  amount
                  currencyCode
                }
                totalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 100) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      variant {
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
                      }
                    }
                  }
                }
              }
              checkoutUserErrors {
                code
                field
                message
              }
            }
          }
        `,
        {
          checkoutId: this.checkoutId,
          lineItems: [{ id: lineItemId, quantity }]
        }
      );

      if (result.data.checkoutLineItemsUpdate.checkoutUserErrors &&
          result.data.checkoutLineItemsUpdate.checkoutUserErrors.length > 0) {
        throw new Error(result.data.checkoutLineItemsUpdate.checkoutUserErrors[0].message);
      }

      const checkout = result.data.checkoutLineItemsUpdate.checkout;
      return {
        id: checkout.id,
        webUrl: checkout.webUrl,
        subtotalPrice: checkout.subtotalPrice.amount,
        totalPrice: checkout.totalPrice.amount,
        currencyCode: checkout.subtotalPrice.currencyCode,
        lineItems: checkout.lineItems.edges.map((edge: any) => {
          const item = edge.node;
          return {
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            variant: {
              id: item.variant.id,
              title: item.variant.title,
              price: item.variant.price.amount,
              image: item.variant.image ? {
                id: item.variant.image.id,
                src: item.variant.image.url,
                altText: item.variant.image.altText
              } : null
            }
          };
        })
      };
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  public async removeCartItem(lineItemId: string) {
    try {
      if (!this.checkoutId) {
        throw new Error('No checkout found');
      }

      const result = await this.fetchStorefront(
        `
          mutation RemoveCheckoutItems($checkoutId: ID!, $lineItemIds: [ID!]!) {
            checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
              checkout {
                id
                webUrl
                subtotalPrice {
                  amount
                  currencyCode
                }
                totalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 100) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      variant {
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
                      }
                    }
                  }
                }
              }
              checkoutUserErrors {
                code
                field
                message
              }
            }
          }
        `,
        {
          checkoutId: this.checkoutId,
          lineItemIds: [lineItemId]
        }
      );

      if (result.data.checkoutLineItemsRemove.checkoutUserErrors &&
          result.data.checkoutLineItemsRemove.checkoutUserErrors.length > 0) {
        throw new Error(result.data.checkoutLineItemsRemove.checkoutUserErrors[0].message);
      }

      const checkout = result.data.checkoutLineItemsRemove.checkout;
      return {
        id: checkout.id,
        webUrl: checkout.webUrl,
        subtotalPrice: checkout.subtotalPrice.amount,
        totalPrice: checkout.totalPrice.amount,
        currencyCode: checkout.subtotalPrice.currencyCode,
        lineItems: checkout.lineItems.edges.map((edge: any) => {
          const item = edge.node;
          return {
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            variant: {
              id: item.variant.id,
              title: item.variant.title,
              price: item.variant.price.amount,
              image: item.variant.image ? {
                id: item.variant.image.id,
                src: item.variant.image.url,
                altText: item.variant.image.altText
              } : null
            }
          };
        })
      };
    } catch (error) {
      console.error('Error removing cart item:', error);
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
      return cart.webUrl; // Return the checkout URL
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }
}

export default ShopifyClient;
