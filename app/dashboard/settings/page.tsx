import { auth } from '@/Server/auth';
import { redirect } from 'next/navigation';
import SettingsCard from './settingsCard';

export default async function Settings(){
  const session = await auth();
  if(!session?.user) redirect('/auth/login');
  if(session) return (
    <SettingsCard session={session}/>
  );
    
}


