export async function GET(request, { params }) {
  const { slug } = await params; // Destructure the slug directly from params

  if (slug === "products") {
    try {
      // Extract query parameters for pagination from the URL
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get("page")) || 1; // Default to page 1
      const limit = parseInt(url.searchParams.get("limit")) || 20; // Default to limit 20
      const category = url.searchParams.get("category");
      const subcategory = url.searchParams.get("subcategory");

      // Construct the API URL correctly
      const apiUrl = `https://albazaarkorea.com/api/productPage?page=${page}&limit=${limit}&category=${category}&subcategory=${subcategory}`;

      // Fetch the paginated product data
      const productResponse = await fetch(apiUrl);
      if (!productResponse.ok) {
        throw new Error("Failed to fetch products");
      }
      const productsData = await productResponse.json();

      // Return both category and product data as JSON
      return new Response(JSON.stringify({ products: productsData }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: 500,
      });
    }
  } else {
    // Handle the case when the slug is not "products"
    return new Response(JSON.stringify({ error: "Invalid slug" }), {
      status: 400,
    });
  }
}
