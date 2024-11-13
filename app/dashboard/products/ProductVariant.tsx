'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VariantsWithImagesTags } from '@/lib/inferType';
import { VariantSchema } from '@/types/VariantSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { InputTags } from './InputTags';
import VariantImages from './VariantImages';
import { useAction } from 'next-safe-action/hooks';
import { CreateVariant } from '@/Server/actons/CreateVariant';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { deleteVariant } from '@/Server/actons/DeleteVariant';

export default function ProductVariant({
  editMode,
  productID,
  variant,
  children,
}: {
    editMode: boolean,
    productID: number,
    variant?: VariantsWithImagesTags,
    children: React.ReactNode
}) {
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: '#000000',
      editMode,
      id: variant?.id,
      productID: productID,
      productType: 'Black Notebook',
    },
    mode: 'onChange',
  });
  const [open, setOpen] = useState(false);
  const setEdit = ()=> {
    if(!editMode){
      form.reset();
      return;
    }
    if(editMode && variant){
      form.setValue('editMode', true);
      form.setValue('id', variant.id);
      form.setValue('productID', variant.productID);
      form.setValue('productType', variant.productType);
      form.setValue('color', variant.color);
      form.setValue('tags', variant.variantTags.map((tag)=> tag.tag));
      form.setValue('variantImages', variant.variantImages.map((img)=> ({
        name: img.name,
        size: img.size,
        url: img.url,
      })));
    }
  };
  useEffect(()=> {
    setEdit();
  },[]);
  const { execute, status } = useAction(CreateVariant, {
    onExecute() {
      toast.loading('Creating variant...'); // Show loading toast when the action starts
    },
    onSettled() {
      setOpen(false);
      toast.dismiss(); // Dismiss toast after the action finishes
    },
    onSuccess: (data) => {
      if (data.success) {
        form.reset();
        toast.success(data.success); // Show success message
      } else if (data.error) {
        toast.error(data.error); // Show error message
      }
    },
    onError: (error) => {
      toast.error('An error occurred during variant creation.'); // Show error if action fails
    },
  });
  const variantAction = useAction(deleteVariant, {
    onExecute() {
      toast.loading('Deleting variant...'); // Show loading toast when the action starts
    },
    onSettled() {
      toast.dismiss();
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success); // Show success message
      } else if (data?.error) {
        toast.error(data.error); // Show error message
      }
    },
    onError: (error) => {
      toast.error('An error occurred during variant deletion.'); // Show error if action fails
    },
  });

  async function onSubmit(values: z.infer<typeof VariantSchema>) {
    console.log('Submitting form with values:', values);
    execute(values); // Ensure async/await to handle any potential async behavior
  }

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-h-[720px] overflow-y-auto rounded-md">
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit' : 'Create'} your variant</DialogTitle>
          <DialogDescription>
                        Manage Your Variants
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a title for your variant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <div className="flex gap-4 items-center justify-center">
              {editMode && variant && (
                <Button
                  type="button"
                  variant={'destructive'}
                  onClick={(e) => {
                    e.preventDefault();
                    variantAction.execute({id:variant.id});
                  }}
                  disabled={variantAction.status === 'executing'}
                >
                                Delete Variant
                </Button>
              )}
              <Button type="submit" disabled={status === 'executing'}>
                {editMode ? 'Update Variant' : 'Create Variant'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
