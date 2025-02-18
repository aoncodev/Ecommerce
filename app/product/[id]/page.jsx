import ProductDetail from "@/components/productDetail";

// app/product/[title_en]/page.jsx

export async function generateMetadata({ searchParams }) {
  const { productId } = await searchParams; // Accessing the query parameter
  const res = await fetch(
    `https://api.albazaarkorea.com/api/product/${productId}`
  );
  const product = await res.json();

  return {
    title: product.title_en,
    description: product.description || "Detailed view of the product.",
  };
}

export default async function ProductPage({ searchParams }) {
  const { productId } = await searchParams; // Accessing the query parameter
  const res = await fetch(
    `https://api.albazaarkorea.com/api/product/${productId}`
  );
  const product = await res.json();

  return (
    <div>
      <ProductDetail product={product} />
    </div>
  );
}
