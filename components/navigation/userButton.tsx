'use client'

import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Avatar, AvatarFallback } from "../ui/avatar"
  import Image from 'next/image'
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useState } from "react"
import { Switch } from "../ui/switch"

export default function UserButton({ user }: Session) {
    const { theme, setTheme } = useTheme()
    const [checked, setChecked] = useState(false)
    const router = useRouter()
    function setSwitchTheme(){
        switch(theme){
            case 'dark':
                setTheme('light')
                return setChecked(true)
            case 'light':
                setTheme('dark')
                return setChecked(false)
           case "system":
                setTheme('light')
                return setChecked(true)
        }

    }
    if(user) return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <Avatar className="h-10 w-10 relative">
                    {user.image ? (
                        <Image 
                            src={user.image}
                            alt={user.name ?? ''}
                            fill
                            className="object-cover rounded-full"
                        />
                    ) : (
                        <AvatarFallback className="bg-primary/10">
                            <div className="font-bold text-primary">
                                {user.name?.[0]?.toUpperCase()}
                            </div>
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-6" align="end">
                <DropdownMenuLabel className="mb-4 p-4 flex flex-col items-center rounded-lg gap-1 bg-primary/10">
                    {user.image && (
                     <Image 
                     src={user.image!}
                     alt={user.name ?? ''}
                     width={36}
                     height={36}
                     className="object-cover rounded-full"
                 />
                )}
                    <p className="text-sm font-medium">
                        {user.name}
                    </p>
                    <span className="text-xs text-secondary-foreground font-medium">
                        {user.email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=> router.push('/dashboard/orders')} className="group py-2 font-medium cursor-pointer transition-all duration-500 hover:bg-primary/10">
                    <TruckIcon size={14} className="mr-3 group-hover:translate-x-1 transition-all duration-300" /> My orders
                </DropdownMenuItem>
                
                {/* Updated Rotation Effect */}
                <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="group py-2 font-medium cursor-pointer  ease-in-out hover:bg-primary/10"
          >
            <Settings
              size={14}
              className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
            />
                    Settings
                </DropdownMenuItem>
                
                <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500 hover:bg-primary/10 group">
                    <div onClick={(e)=> {e.stopPropagation()}} className="flex items-center gap-2">
                        <div className="relative flex mr-3">
                        <Sun size={14} className="absolute group-hover:text-yellow-600 group-hover:rotate-180 dark:scale-0 dark:-rotate-90 transition-all duration-300 ease-in-out"/>
                        <Moon size={14} className="group-hover:text-blue-400 group-hover:rotate-180  transition-all duration-300 ease-in-out dark:scale-100 scale-0"/>
                        </div>
                        
                        <p className="dark:text-blue-400 text-secondary-foreground/75  text-yellow-600">
                             {theme?.[0].toUpperCase() + theme?.slice(1)} mode
                        </p>
                        <Switch checked={checked} className="scale-75 ml-2" onCheckedChange={(e)=> {
                            setChecked((prev) => !prev)
                            if(e) setTheme("dark")
                            if(!e) setTheme("light")
                        }}/>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 focus:bg-destructive group font-medium cursor-pointer transition-all duration-500 text-red-600 hover:bg-red-400 hover:text-black" onClick={() => signOut()}>
                 <LogOut size={14} className="mr-2 group-hover:scale-75 transition-all duration-300" /> Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
