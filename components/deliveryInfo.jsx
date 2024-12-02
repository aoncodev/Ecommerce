import { Truck, Clock, MapPin, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DeliveryInfo() {
  return (
    <Card className="w-full max-w-6xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Welcome to Al Bazaar!
        </CardTitle>
        <CardDescription className="text-center">
          We're thrilled to offer you speedy delivery for your grocery needs.
          Here's a quick rundown of our shipping process:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="delivery-time">
            <AccordionTrigger>
              <div className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-primary" />
                <span>Delivery Time</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              Orders within Korea are typically delivered within 1 business day,
              as long as they are placed by 3pm. Please note that delivery to
              Jeju might take 2 days due to geographical considerations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cut-off-time">
            <AccordionTrigger>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <span>Cut-off Time</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              For same-day shipping, make sure to place your order by 3pm.
              Orders received after this time will be processed the next
              business day.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="jeju-orders">
            <AccordionTrigger>
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <span>Jeju Orders on Friday</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              If you're placing an order on Friday for delivery to Jeju, please
              be aware that due to the extended delivery timeframe, your order
              will be shipped the following week to ensure freshness.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              Thank you for choosing Al Bazaar! If you have any questions, our
              support team is ready to assist you. Happy shopping!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
