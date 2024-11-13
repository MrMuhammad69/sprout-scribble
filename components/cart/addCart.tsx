'use client';

import { useCartStore } from '@/lib/clientStore';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { redirect, useSearchParams } from 'next/navigation';
import {auth} from '@/Server/auth';// Import your auth function

export default function AddCart({user}: {user: any}) {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1); // State to hold the user data
  const params = useSearchParams();
  const id = Number(params.get('id'));
  const productID = Number(params.get('productID'));
  const title = params.get('title');
  const type = params.get('type');
  const price = Number(params.get('price'));
  const image = params.get('image');

  // Check for user authentication on mount

  if (!id || !productID || !title || !type || !price || !image) {
    toast.error('Something went wrong');
    return redirect('/');
  }

  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          variant={'secondary'}
          className="text-primary"
          onClick={() => {
            if (quantity > 1) setQuantity(quantity - 1);
          }}
        >
          <Minus size={16} strokeWidth={3} />
        </Button>
        <Button className="flex-1">Quantity: {quantity}</Button>
        <Button
          variant={'secondary'}
          className="text-primary"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus size={16} strokeWidth={3} />
        </Button>
      </div>

      <Button
        onClick={() => {
          if (user) {
            toast.success(`Added ${title} ${type} to your cart`);
            addToCart({
              id: productID,
              variant: {
                variantID: id,
                quantity: quantity,
              },
              price: price,
              name: title + ' ' + type,
              image: image,
            });
          } else {
            toast.error('Please sign in to add to cart');
          }
        }}
        disabled={!user} // Disable button if user is not authenticated
      >
        {user ? 'Add to Cart' : 'Sign in to add to cart'}
      </Button>
    </>
  );
}
