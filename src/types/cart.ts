/**
 * Enhanced cart types with optimistic update support
 * Extends existing CartContext types
 */

export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  quantity: number
  image: string

  // New variant support (optional)
  variantId?: string
  variantTitle?: string
  selectedOptions?: {
    name: string
    value: string
  }[]
}

export interface CartAction {
  type: 'add' | 'remove' | 'update' | 'clear'
  item?: Omit<CartItem, 'quantity'>
  productId?: string
  quantity?: number
  timestamp: number
}

export interface CartHistory {
  actions: CartAction[]
  maxHistory: number
}

export interface OptimisticCartState {
  items: CartItem[]
  isPending: boolean
  pendingAction?: CartAction
}
