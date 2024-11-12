import {auth} from '@/Server/auth'
import Logo from './logo'
import UserButton from './userButton'
import { Button } from '../ui/button'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import CartDrawer from '../cart/cart-drawer'
export default async function Nav(){
    const session = await auth()
    
    return(
        <header className=' py-8 '>
            <nav>
                <ul className='flex justify-between items-center md:gap-8 gap-4 md:flex-row '>
                    <li className='flex flex-1'>
                        <Link href='/'>
                            <Logo />
                        </Link>
                    </li>
                    {session &&(
                        <li className='relative flex items-center hover:bg-muted'>
                        <CartDrawer />
                    </li>
                    )}
                    
                    <li>
                        {!session ? (
                            <Button asChild>
                                <Link className='flex justify-between' href='/auth/login'>
                                <LogIn size={16}/>
                                <span>Sign In</span>
                                </Link>
                            </Button>
                        ):(
                            <UserButton user={session?.user} expires={session?.expires} />
                        )}
                        
                    </li>
                </ul>
            </nav>
        </header>
    )
}