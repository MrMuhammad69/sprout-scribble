'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Session } from "next-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SettingsSchema } from "@/types/settingsSechema"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/FormSuccess"
import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { setting } from "@/Server/actons/settings"

type SettingsFrom = {
    session:Session
}

export default function SettingsCard(session: SettingsFrom){
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver:zodResolver(SettingsSchema),
        defaultValues:{
            name:session.session.user?.name || undefined,
            image:session.session.user?.image || undefined,
            twoFactorEnabled:session.session.user?.twoFactorEnabled || undefined,
            password: undefined,
            newPassword: undefined,
        },
    })
    console.log(session.session.user)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [avatarUploading, setAvatarUploading] = useState(false)
    const {execute, status} = useAction(setting, {
        onSuccess: (data) => {
            if(data?.success) setSuccess(data.success)
            if(data?.error) setError(data.error || "Something went wrong")
        },
        onError: (error) => {
            setError("Something went wrong")
        }

    })
    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        execute(values)
    }
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
                <Input placeholder="Your Name" disabled={status === "executing"} {...field} />
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
                {!form.getValues("image") && (
                    <div className="font-bold">
                        <Avatar>
                        <AvatarFallback>
                            {session.session.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    </div>
                )}
                {form.getValues("image") && (
                    <Image src={form.getValues("image")!} alt="User image" width={42} height={42} className="rounded-full" />
                )}

              </div>
              <FormControl >
                <Input placeholder="User image" type="hidden" disabled={status === "executing" || session.session.user?.isOAuth === true} {...field} />
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
                <Input placeholder="Your password" disabled={status === "executing" || session.session.user?.isOAuth === true} {...field} />
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
                <Input placeholder="New password" disabled={status === "executing" || session.session.user?.isOAuth === true} {...field} />
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
                <Switch checked={field.value} disabled={status === "executing" || session.session.user?.isOAuth === true} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button type="submit" disabled={status === "executing" || avatarUploading}>Update Your Settings</Button>
      </form>
    </Form>
  </CardContent>
</Card>

    )
}


