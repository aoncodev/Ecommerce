export async function GET(request) {
  try {
    // Extract query parameters for pagination from the URL
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(url.searchParams.get("limit")) || 20; // Default to limit 10

    // Fetch the category data
    const categoryResponse = await fetch(
      "https://albazaarkorea.com/api/subcategory"
    );
    if (!categoryResponse.ok) {
      throw new Error("Failed to fetch categories");
    }
    const categories = await categoryResponse.json();

    // Return both category and product data as JSON
    return new Response(JSON.stringify({ categories }), {
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
}
