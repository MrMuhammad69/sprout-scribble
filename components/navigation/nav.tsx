import {auth} from '@/Server/auth'
import Logo from './logo'
import UserButton from './userButton'
import { Button } from '../ui/button'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
export default async function Nav(){
    const session = await auth()
    
    return(
        <header className=' py-8 '>
            <nav>
                <ul className='flex justify-between'>
                    <li>
                        <Link href='/'>
                            <Logo />
                        </Link>
                    </li>
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