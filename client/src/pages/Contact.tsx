import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-4xl mb-4">Contact Us</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Have questions? We're here to help. Reach out to us for any queries related to tests, reports, or home collection.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Info Cards */}
           <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                 <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Call Us</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
              <p className="text-muted-foreground">+1 (555) 987-6543</p>
           </div>
           
           <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                 <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Email Us</h3>
              <p className="text-muted-foreground">info@archanalabs.com</p>
              <p className="text-muted-foreground">support@archanalabs.com</p>
           </div>
           
           <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                 <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Working Hours</h3>
              <p className="text-muted-foreground">Mon - Sat: 7am - 9pm</p>
              <p className="text-muted-foreground">Sun: 8am - 2pm</p>
           </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
           <div className="p-8 md:p-12">
              <h2 className="font-display font-bold text-3xl mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="Your Phone" />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">Email</label>
                   <Input placeholder="Your Email" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">Message</label>
                   <Textarea placeholder="How can we help you?" className="min-h-[150px]" />
                </div>
                <Button className="w-full h-12 font-bold text-lg">Send Message</Button>
              </form>
           </div>

           <div className="bg-slate-100 relative h-[400px] lg:h-auto">
             {/* Map Placeholder */}
             <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-slate-200">
               <div className="text-center">
                 <MapPin className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                 <p className="font-medium">Map Integration</p>
                 <p className="text-sm">123 Healthcare Ave, Medical District</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
