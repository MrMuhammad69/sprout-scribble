'use client';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { VariantsWithImagesTags } from '@/lib/inferType';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
  
export default function ProductShowCase({variants}:{variants:VariantsWithImagesTags[]}){
  const [api, setApi] = useState<CarouselApi>();
  const updatePreview= (index: number)=> {
    api?.scrollTo(index);
  };
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get('type') || variants[0].productType;
  useEffect(() => {
    if(!api) return;
    api.on('slidesInView', (e) => {
      setActiveThumbnail(e.slidesInView());
    });
  });
  return(
    <Carousel setApi={setApi} opts={{loop: true}}>
      <CarouselContent>
        {variants.map((variant) => (
          variant.productType === selectedColor && (
            variant.variantImages.map((image ) => (
              <CarouselItem key={image.id}>
                {image.url ? (
                  <Image priority src={image.url} alt={image.name} width={720} height={480} />
                ):(null)}
              </CarouselItem>
            ))
          )
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <div className="flex gap-2 overflow-clip py-2">
        {variants.map((variant) => (
          variant.productType === selectedColor && (
            variant.variantImages.map((image, index ) => (
              <div key={image.id}>
                {image.url ? (
                  <Image onClick={() => updatePreview(index) } priority className={cn(index === activeThumbnail[0] ? 'opacity-100' : 'opacity-50', 'rounded-md transition-all duration-300 ease-in-out hover: opacity-75 cursor-pointer')} src={image.url} alt={image.name} width={72} height={48} />
                ):(null)}
              </div>
            ))
          )
        ))}
      </div>
    </Carousel>

  );
}