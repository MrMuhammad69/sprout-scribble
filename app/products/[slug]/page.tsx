import ProductType from '@/components/products/ProductType';
import { db } from '@/Server';
import { productVariants } from '@/Server/schema';
import { eq } from 'drizzle-orm';
import { Separator } from '@/components/ui/separator';
import FormatPrice from '@/lib/formatPrice';
import ProductPick from '@/components/products/productPick';
import ProductShowCase from '@/components/products/ProductShowCase';
import Reviews from '@/components/reviews/reviews';
import { getReviewAverage } from '@/components/reviews/reviewAverage';
import Stars from '@/components/reviews/stars';
import AddCart from '@/components/cart/addCart';
import { auth } from '@/Server/auth';

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugID;
  }
  return [];
}

export const revalidate = 60;

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth(); // Get session in Page component, not in generateStaticParams
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          reviews: true,
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
    },
  });

  if (!variant) {
    return <div>Product not found</div>; // Handle the case where the product is not found
  }

  return (
    <main>
      <section className="flex flex-col gap-4 lg:flex-row lg:gap-12">
        <div className="flex-1">
          <ProductShowCase variants={variant.product.productVariants} />
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-3xl font-bold">{variant.product.title}</h2>
          <div>
            <ProductType variants={variant.product.productVariants} />
            <Stars
              rating={parseFloat(getReviewAverage(variant.product.reviews))}
              totalReviews={variant.product.reviews.length}
            />
          </div>

          <Separator className="my-3" />
          <p className="text-2xl font-medium py-2">{FormatPrice(variant.product.price)}</p>
          <div dangerouslySetInnerHTML={{ __html: variant.product.description }}></div>
          <p className="text-secondaryForeground py-2 font-medium my-2">Available Colors</p>
          <div className="flex gap-2">
            {variant.product.productVariants.map((prodVariant) => (
              <ProductPick
                key={prodVariant.id}
                productID={variant.productID}
                productType={prodVariant.productType}
                id={prodVariant.id}
                color={prodVariant.color}
                price={variant.product.price}
                title={variant.product.title}
                image={prodVariant.variantImages[0]?.url} // Ensure image exists
              />
            ))}
          </div>
          <AddCart user={session?.user} /> {/* Pass the session object here */}
        </div>
      </section>
      <Reviews productID={variant.productID} />
    </main>
  );
}
