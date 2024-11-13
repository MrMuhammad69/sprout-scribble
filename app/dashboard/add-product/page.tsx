import { auth } from '@/Server/auth';
import { redirect } from 'next/navigation';
import ProductForm from './productForm';
export default async function AddProduct(){
  const session = await auth();
  if(!session?.user || session?.user.role !== 'admin'){
    return redirect('/auth/login');
  } 
   
  return(
    <ProductForm/>
  );
}