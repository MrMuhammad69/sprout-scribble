import {create} from 'zustand'


type Variant ={
    varinatID: number,
    quantity: number
}

export type CartItem = {
    name: string,
    image: string,
    id: number,
    variant: Variant
}

export type CartState = {
    cart: CartItem[], 
    addToCart: (item: CartItem) => void,
    removeFromCart: (item: CartItem) => void,
    clearCart: () => void,
    updateQuantity: (item: CartItem, quantity: number) => void
}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    addToCart: (item: CartItem) => set((state) => ({cart: [...state.cart, item]})),
    removeFromCart: (item: CartItem) => set((state) => ({cart: state.cart.filter((cartItem) => cartItem.id !== item.id)})),
    clearCart: () => set(() => ({cart: []})),
    updateQuantity: (item: CartItem, quantity: number) => set((state) => ({cart: state.cart.map((cartItem) => cartItem.id === item.id ? {...cartItem, quantity} : cartItem)}))

}))