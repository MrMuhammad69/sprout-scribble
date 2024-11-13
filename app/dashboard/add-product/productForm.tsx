'use client';

import { ProductSchema } from '@/types/ProductSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';
import Tiptap from './tipTap';
import { createProduct } from '@/Server/actons/CreateProduct';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getProduct } from '@/Server/actons/GetProduct';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductForm() {
  const [loading, setLoading] = useState(false );
  const searchParams = useSearchParams();
  const editMode = searchParams.get('id');

  const checkProduct = async (id: number) => {
    if (editMode) {
      const { error, success } = await getProduct(parseInt(editMode));
      if (error) {
        toast.error(error);
        router.push('/dashboard/products');
        setLoading(false);
        return;
      }
      if (success) {
        const id = parseInt(editMode);
        form.setValue('title', success.title);
        form.setValue('description', success.description);
        form.setValue('price', success.price);
        form.setValue('id', id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if(editMode) {
      checkProduct(parseInt(editMode));
    }
  }, [editMode]);

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
    mode: 'onChange',
  });
  const router = useRouter();
  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      if (data?.success) {
        console.log('Success:', data.success); // Debugging
        router.push('/dashboard/products');
        toast.success(data.success);
      }
      if (data?.error) {
        console.log('Error:', data.error); // Debugging
        toast.error(data.error);
      }
    },
    onError: (error) => {
      console.log('Error:', error); // Debugging
      toast.error(error.fetchError || 'An error occurred');
    },
    onExecute: () => {
      console.log('Executing...'); // Debugging
      toast.loading('Creating product...');
    },
    onSettled: () => {
      toast.dismiss();
    },
  });
  const onSubmit = (values: z.infer<typeof ProductSchema>) => {
    execute(values);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? <span>
                    Edit Prodcut
        </span>: <span>
                    Create Product</span>}</CardTitle>
        <CardDescription>{editMode? <span>
                    Edit The Product in your Store
        </span>: <span>
                Add a new product to the store</span>}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-8">
            <Skeleton className="w-full h-10 rounded-md" /> {/* Title Skeleton */}
            <Skeleton className="w-full h-32 rounded-md" /> {/* Description Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" /> {/* Dollar Sign Skeleton */}
              <Skeleton className="w-full h-10 rounded-md" /> {/* Price Skeleton */}
            </div>
            <Skeleton className="w-32 h-10 rounded-md" /> {/* Button Skeleton */}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of your Product" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Tiptap val={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price of the Product</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <DollarSign size={32} className="p-2 rounded-md bg-violet-100" />
                        <Input
                          type="number"
                          placeholder="Product price"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty} type="submit">{editMode? 'Save Changes': 'Create Product'}</Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}