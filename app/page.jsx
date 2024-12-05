import { Metadata } from "next";
import ProductPage from "@/components/home";
import ClientProductPage from "@/components/clientMount";

export async function generateMetadata() {
  // Fetch site information from your API
  const res = await fetch("https://albazaarkorea.com/api/category");
  const siteInfo = await res.json();

  return {
    title: siteInfo.title || "Al Bazaar Korea",
    description:
      siteInfo.description ||
      "Discover a wide range of products at Al Bazaar Korea.",
    openGraph: {
      title: siteInfo.ogTitle || "Al Bazaar Korea - Online Shopping",
      description:
        siteInfo.ogDescription ||
        "Find the best products from Korea at Al Bazaar.",
      images: [
        {
          url:
            siteInfo.ogImage ||
            "https://albazaarkorea.com/product/Beef%20knuckle%20?productId=8HZXD4YK97",
          width: 1200,
          height: 630,
          alt: "Al Bazaar Korea",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteInfo.twitterTitle || "Al Bazaar Korea - Online Shopping",
      description:
        siteInfo.twitterDescription ||
        "Find the best products from Korea at Al Bazaar.",
      images: [
        siteInfo.twitterImage ||
          "https://albazaarkorea.com/default-twitter-image.jpg",
      ],
    },
  };
}

export default function HomePage() {
  return <ClientProductPage />;
}
