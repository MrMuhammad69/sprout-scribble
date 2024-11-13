'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Session } from 'next-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { SettingsSchema } from '@/types/settingsSechema';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { setting } from '@/Server/actons/settings';
import { UploadButton } from '@/app/api/uploadthing/upload';
import { useRouter } from 'next/navigation';

type SettingsFrom = {
    session:Session
}
type UploadResponse = { url?: string }[];


export default function SettingsCard(session: SettingsFrom){
  const router = useRouter();
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver:zodResolver(SettingsSchema),
    defaultValues:{
      name:session.session.user?.name || undefined,
      image:session.session.user?.image || undefined,
      twoFactorEnabled:session.session.user?.twoFactorEnabled || undefined,
      password: undefined,
      newPassword: undefined,
    },
  });
  console.log(session.session.user);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const {execute, status} = useAction(setting, {
    onSuccess: (data) => {
      if(data?.success) {
        setSuccess(data.success);
        if(data.redirect) {
          // Force a hard refresh to get new session data
          router.refresh();
          window.location.reload();
        }
      }
      if(data?.error) setError(data.error || 'Something went wrong');
    },
    onError: (error) => {
      setError('Something went wrong');
    },
  });
  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    console.log('Submitting values:', values); // Log form values
    try {
      await execute(values);
    } catch (error) {
      console.error('Form submission error:', error);
      setError('Failed to update settings');
    }
  };

  const handleUploadComplete = async (res:  UploadResponse) => {
    if (res?.[0]?.url) {
      console.log('Upload complete, URL:', res[0].url); // Log upload URL
      form.setValue('image', res[0].url);
      setAvatarUploading(false);
            
      // Get all current form values
      const values = form.getValues();
      console.log('Submitting values after upload:', values); // Log form values
            
      try {
        await execute(values);
      } catch (error) {
        console.error('Upload complete submission error:', error);
        setError('Failed to update settings');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your settings</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl >
                    <Input placeholder="Your Name" disabled={status === 'executing'} {...field} />
                  </FormControl>
                  <FormDescription>
                This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues('image') && (
                      <div className="font-bold">
                        <Avatar>
                          <AvatarFallback>
                            {session.session.user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    {form.getValues('image') && (
                      <Image src={form.getValues('image')!} alt="User image" width={42} height={42} className="rounded-full" />
                    )}
                    <UploadButton
                      className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                      endpoint="avatarUploader"
                      onUploadBegin={() => {
                        setAvatarUploading(true);
                      }}
                      onUploadError={(error) => {
                        form.setError('image', {
                          type: 'validate',
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={handleUploadComplete}
                      content={{
                        button({ ready }) {
                          if (avatarUploading) return 'Uploading...';
                          return 'Change Avatar';
                        },
                      }}
                    />
                  </div>
                  <FormControl >
                    <Input placeholder="User image" type="hidden" disabled={status === 'executing' || session.session.user?.isOAuth === true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl >
                    <Input placeholder="Your password" disabled={status === 'executing' || session.session.user?.isOAuth === true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl >
                    <Input placeholder="New password" disabled={status === 'executing' || session.session.user?.isOAuth === true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>Enable two factor authentication</FormDescription>
                  <FormControl >
                    <Switch checked={field.value} disabled={status === 'executing' || session.session.user?.isOAuth === true} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success}  />
            <Button type="submit" disabled={status === 'executing' || avatarUploading}>Update Your Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>

  );
}


