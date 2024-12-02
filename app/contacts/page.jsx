import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen container mx-auto px-4 mt-16 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>서울시 영산구 우사단로10길23 지하층</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p>010-8779-0672</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>albazaarkorea@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Clock className="text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            <div className="pt-4">
              <h3 className="font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/albazaarkorea/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="https://www.instagram.com/albazaarkorea/?hl=ko"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.328026440557!2d126.98961661531305!3d37.54641797980242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca257a88e6aa7%3A0x5cf8577b2b59aa6d!2s23%20Usadan-ro%2010-gil%2C%20Yongsan-gu%2C%20Seoul%2C%20South%20Korea!5e0!3m2!1sen!2sus!4v1621234567890!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
