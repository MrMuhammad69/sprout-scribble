'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import styles from './error.module.css'; // Importing CSS module
import { cn } from '@/lib/utils';
import { CircleX } from 'lucide-react';
export default function Error({
  error,
  reset,
}: {
    error: Error,
    reset: () => void
}) {
  const [loading, setLoading] = useState(true);


  return (
    <div className="w-full h-full flex items-center justify-center flex-col my-3 p-10">
      <motion.div
        className="text-4xl font-bold  text-destructive"
      >
        <div className={` ${styles.errorContainer}`}>
          <h1 className={styles.errorCode}>We are Sorry
          </h1>
                    
          <h2 className={cn(styles.errorMessage, 'text-xl')}>{error.message} Please report us if the issue persists @ibneabdullatifjud@gmail.com <b>:(</b></h2>
          <div className={styles.gears}>
            <div className={`${styles.gear} ${styles.one}`}>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
            </div>
            <div className={`${styles.gear} ${styles.two}`}>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
            </div>
            <div className={`${styles.gear} ${styles.three}`}>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
            </div>
          </div>
        </div>
      </motion.div>
      <Button onClick={() => reset()} className="bg-destructive hover:bg-destructive/50">
                Try Again Later
      </Button>
    </div>
  );
}
