import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your message has been sent. We'll get back to you soon.",
        });
        form.reset();
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send your message. Please try again later.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <Navbar />
      <div className="container mx-auto max-w-6xl">
        
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-lg mb-10 text-center max-w-3xl mx-auto">
          Get in touch with our team for any inquiries or support. We're here to help you.
        </p>
        
        {/* Contact Form First */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email:</p>
                    <a href="mailto:info@eythor.com" className="text-blue-500 hover:underline">
                      business.eythor@gmail.com
                    </a>
                  </div>
                  {/* <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone:</p>
                    <a href="tel:+1234567890" className="hover:text-blue-500 transition-colors">
                    +91 70151 38654
                    </a>
                  </div> */}
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your message" rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Office Locations - Now Displayed Below Form */}
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Offices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* India Office */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium border-b pb-2 mb-4">India Office</h3>
              <div className="flex items-start mb-4">
                <MapPin className="mr-2 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium">Delhi Office</p>
                  <p className="text-muted-foreground">
                    IIF Delhi Technological University,<br />
                    Bawana Road, Delhi,<br />
                    Delhi-110042, India
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden h-48 mt-2">
                <iframe 
                  title="Eythor Delhi Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.8527123611485!2d77.11177551098711!3d28.75004623273737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0138a74f7da7%3A0xf09c7eb843ad9022!2sDelhi%20Technological%20University!5e0!3m2!1sen!2sin!4v1711297316147!5m2!1sen!2sin"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>
          
          {/* Australia Office */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium border-b pb-2 mb-4">Overseas Office</h3>
              <div className="flex items-start mb-4">
                <MapPin className="mr-2 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium">Perth Office</p>
                  <p className="text-muted-foreground">
                    Riff<br />
                    45 St George's Terrace,<br />
                    Perth, WA, Australia
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden h-48 mt-2">
                <iframe 
                  title="Eythor Perth Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.5337489455396!2d115.85573357611537!3d-31.955620974386852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32bad605111c31%3A0xe10c42437be72ed!2s45%20St%20Georges%20Terrace%2C%20Perth%20WA%206000%2C%20Australia!5e0!3m2!1sen!2sus!4v1706128394206!5m2!1sen!2sus"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">How quickly can I get a robot installed?</h3>
                <p className="text-muted-foreground">
                  Typically, we can deliver and install a robot within 5-6 weeks of confirming your order, depending on your location and the size of your installation.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">What maintenance does the robot require?</h3>
                <p className="text-muted-foreground">
                  Our robots are designed for minimal maintenance. They require a simple quarterly check-up and brush, cloth replacement, which can be performed by our staff.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Do you offer maintenance contracts?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer annual maintenance contracts (AMC) to ensure your robot operates at peak performance. Contact our sales team for more details.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">How does the robot handle different weather conditions?</h3>
                <p className="text-muted-foreground">
                  The robot is designed to operate in various weather conditions but will automatically return to its docking station during extreme weather.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
