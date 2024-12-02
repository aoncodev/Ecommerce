import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutUs() {
  return (
    <div className="container mt-16 mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        About ALBAZAAR KOREA
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Our History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In South Korea, Islam (이슬람교) is a minority religion. The Muslim
            community is mostly centered in Seoul and Mosques were built around
            the country. According to the Korea Muslim Federation, about 100,000
            Muslims are living in the beautiful land of South Korea, both
            Koreans and foreigners.
          </p>
          <p>
            With the undeniable growth of Muslim people in the country, comes
            the increasing demand for halal products. And it's a great challenge
            to find these because of the diversity of the communities around
            Seoul. We know it because we ourselves had problems finding halal
            food inside the country.
          </p>
          <p>
            Majority of the Muslim community in South Korea are foreigners –
            working, studying or on a vacation. Most of them are very busy to
            scrutinize the cities finding halal groceries. With these in mind,
            we brought up AL BAZAAR KOREA.
          </p>
          <p>
            AL BAZAAR KOREA is an e-commerce company aiming to help Muslim
            people in South Korea have a better life in a foreign country. Since
            the cost of living here is not cheap, it's always advisable to
            prepare your own meal at home. You are sure it's halal, you are sure
            it's healthy. Thus, we promote halal meat and groceries and soon to
            expand to more varieties of products.
          </p>
          <p>
            The company's main goal is establishing a friendly community and
            encourage people to eat halal food no matter how busy they are. Al
            Bazaar will bring you the halal market right to your doorsteps.
          </p>
          <p>
            So, if you are looking for high-quality halal meat and groceries for
            very affordable prices, Al Bazaar is the best shop to get these. Not
            only that we deliver fast, but we also deliver anywhere in South
            Korea. Experience the highest convenience of shopping halal
            products. AL BAZAAR KOREA
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Shipping Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg">Delivery Time</h3>
          <p>
            Orders within Korea are typically delivered within 1 business day,
            as long as they are placed by 3pm. Please note that delivery to Jeju
            might take 2 days due to geographical considerations.
          </p>

          <h3 className="font-semibold text-lg">Cut-off Time</h3>
          <p>
            For same-day shipping, make sure to place your order by 3pm. Orders
            received after this time will be processed the next business day.
          </p>

          <h3 className="font-semibold text-lg">Jeju Orders on Friday</h3>
          <p>
            If you're placing an order on Friday for delivery to Jeju, please be
            aware that due to the extended delivery timeframe, your order will
            be shipped the following week to ensure freshness.
          </p>

          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold">Thank you for choosing Al Bazaar!</p>
            <p>
              If you have any questions, our support team is ready to assist
              you. Happy shopping!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
