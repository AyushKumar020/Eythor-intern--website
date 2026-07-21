
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This would be replaced with actual form submission logic
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`glass-effect p-6 rounded-lg ${className}`}>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 text-white/80">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-md bg-eythor-dark/50 border border-white/10 focus:border-eythor-purple/50 focus:outline-none focus:ring-1 focus:ring-eythor-purple/50 transition-all"
          placeholder="Your Name"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 text-white/80">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-md bg-eythor-dark/50 border border-white/10 focus:border-eythor-purple/50 focus:outline-none focus:ring-1 focus:ring-eythor-purple/50 transition-all"
          placeholder="your.email@example.com"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="message" className="block mb-2 text-white/80">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full p-3 rounded-md bg-eythor-dark/50 border border-white/10 focus:border-eythor-purple/50 focus:outline-none focus:ring-1 focus:ring-eythor-purple/50 transition-all resize-none"
          placeholder="How can we help you?"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="cta-button w-full flex items-center justify-center"
      >
        {loading ? (
          <span className="inline-block h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
        ) : null}
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
