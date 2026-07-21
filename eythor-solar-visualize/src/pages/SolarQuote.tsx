import React, { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormProvider, useForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Sparkles, Home, Building2, Sun, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import VideoBackground from '@/components/VideoBackground';
import Footer from '@/components/Footer';

const purposeSchema = z.enum(['household', 'warehouse', 'solar-farm']);

const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  installationAddress: z.string().min(5, 'Address must be at least 5 characters'),
  purpose: purposeSchema,
});

const householdOptionSchema = z.enum(['call-engineer', 'self-provide']);

const step2HouseholdSchema = z.object({
  householdOption: householdOptionSchema,
});

const panelDetailsSchema = z.object({
  panelType: z.string().min(1, 'Please select panel type'),
  panelCount: z.string().min(1, 'Please enter number of panels'),
  roofType: z.string().min(1, 'Please select roof type'),
  roofAngle: z.string().min(1, 'Please select roof angle'),
  shading: z.string().min(1, 'Please select shading condition'),
  additionalNotes: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2HouseholdData = z.infer<typeof step2HouseholdSchema>;
type PanelDetailsData = z.infer<typeof panelDetailsSchema>;

type FormData = Step1Data & Step2HouseholdData & PanelDetailsData;

const purposeOptions = [
  { value: 'household', label: 'Household / Residential', icon: Home, desc: 'Perfect for homes and small residential setups' },
  { value: 'warehouse', label: 'Warehouse / Commercial', icon: Building2, desc: 'For commercial buildings and warehouses' },
  { value: 'solar-farm', label: 'Solar Farm / Utility Scale', icon: Sun, desc: 'Large-scale solar farm installations' },
];

const panelTypeOptions = [
  { value: 'monocrystalline', label: 'Monocrystalline' },
  { value: 'polycrystalline', label: 'Polycrystalline' },
  { value: 'thin-film', label: 'Thin Film' },
  { value: 'bifacial', label: 'Bifacial' },
  { value: 'other', label: 'Other' },
];

const roofTypeOptions = [
  { value: 'flat', label: 'Flat Roof' },
  { value: 'pitched', label: 'Pitched Roof' },
  { value: 'metal', label: 'Metal Roof' },
  { value: 'tile', label: 'Tile Roof' },
  { value: 'ground', label: 'Ground Mounted' },
  { value: 'other', label: 'Other' },
];

const roofAngleOptions = [
  { value: '0-10', label: '0° - 10° (Flat)' },
  { value: '10-20', label: '10° - 20°' },
  { value: '20-30', label: '20° - 30°' },
  { value: '30-40', label: '30° - 40°' },
  { value: '40+', label: '40°+' },
];

const shadingOptions = [
  { value: 'none', label: 'No Shading' },
  { value: 'minimal', label: 'Minimal (Morning/Evening only)' },
  { value: 'moderate', label: 'Moderate (Partial during day)' },
  { value: 'heavy', label: 'Heavy (Significant shading)' },
];

const SolarQuote = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getCurrentSchema = () => {
    switch (step) {
      case 1:
        return step1Schema;
      case 2:
        return step1Schema.merge(step2HouseholdSchema);
      case 4:
        return step1Schema.merge(step2HouseholdSchema).merge(panelDetailsSchema);
      default:
        return step1Schema;
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      installationAddress: '',
      purpose: 'household',
      householdOption: 'call-engineer',
      panelType: '',
      panelCount: '',
      roofType: '',
      roofAngle: '',
      shading: '',
      additionalNotes: '',
    },
  });

  const handleStep1Submit = (data: Step1Data) => {
    if (data.purpose === 'household') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleStep2HouseholdSubmit = (data: Step2HouseholdData) => {
    if (data.householdOption === 'self-provide') {
      navigate('/solar-panel-setup');
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async (data?: PanelDetailsData) => {
    setIsSubmitting(true);
    try {
      const formData = form.getValues();
      const submitData = data ? { ...formData, ...data } : formData;
      
      console.log('Form submitted:', submitData);
      
      toast({
        title: 'Quote Request Submitted!',
        description: 'Our team will contact you within 24 hours with a customized quote for your Eyto solar panel cleaning robot.',
        variant: 'default',
      });
      
      form.reset();
      setStep(1);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit quote request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };


  const FormInput = ({ label, placeholder, field, type = "text", icon: Icon }: { label: string; placeholder: string; field: any; type?: string; icon?: any }) => (
    <FormItem className="group">
      <FormLabel className="text-white/80 text-sm font-medium flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-eythor-blue" />}
        {label}
      </FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                       focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                       transition-all duration-300 rounded-lg h-11
                       hover:border-white/20"
          />
          <div className="absolute inset-0 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-eythor-blue/20 to-transparent rounded-lg blur-sm"></div>
          </div>
        </div>
      </FormControl>
      <FormMessage className="text-xs text-red-400" />
    </FormItem>
  );

  const renderStep1 = () => (
    <form onSubmit={form.handleSubmit(handleStep1Submit)} className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5 text-eythor-blue" />
          <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Get Started</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient-blue">Your Custom Quote</span>
        </h2>
        <p className="text-white/50 text-sm max-w-md mx-auto">Tell us about your project so we can provide the best solar solution for you</p>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Full Name" placeholder="John Doe" field={form.register('name')} icon={Sparkles} />
        <FormInput label="Email Address" placeholder="john@example.com" field={form.register('email')} type="email" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Phone Number" placeholder="+91 98765 43210" field={form.register('phone')} type="tel" />
        
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem className="group">
              <FormLabel className="text-white/80 text-sm font-medium flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-eythor-blue" />
                Purpose of Purchase *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/[0.03] border-white/10 text-white 
                    focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                    transition-all duration-300 rounded-lg h-11 hover:border-white/20">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                  {purposeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white/70 hover:text-white focus:text-white focus:bg-eythor-blue/10">
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="installationAddress"
        render={({ field }) => (
          <FormItem className="group">
            <FormLabel className="text-white/80 text-sm font-medium">Installation Address *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Complete address where the robot will be installed" 
                {...field} 
                rows={2} 
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                  focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                  transition-all duration-300 rounded-lg hover:border-white/20 resize-none" 
              />
            </FormControl>
            <FormMessage className="text-xs text-red-400" />
          </FormItem>
        )}
      />

      <div className="flex items-center gap-3 p-3 bg-eythor-blue/5 border border-eythor-blue/10 rounded-lg">
        <Sparkles className="w-4 h-4 text-eythor-blue flex-shrink-0" />
        <p className="text-xs text-white/50">Your information is secure and will only be used to provide you with the best quote</p>
      </div>

      <div className="flex justify-between pt-2">
        <div></div>
        <Button type="submit" className="cta-button group gap-2" disabled={isSubmitting}>
          <span>Next Step</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </form>
  );

  const renderStep2Household = () => {
    return (
      <form onSubmit={form.handleSubmit(handleStep2HouseholdSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-4">
            <Home className="w-3.5 h-3.5 text-eythor-blue" />
            <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Household</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-blue">How to Proceed?</span>
          </h2>
          <p className="text-white/50 text-sm">Choose how you'd like to get your personalized quote</p>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="householdOption"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                  <div 
                    className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 group
                      ${field.value === 'call-engineer' 
                        ? 'bg-eythor-blue/10 border-eythor-blue/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'}`}
                    onClick={() => field.onChange('call-engineer')}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value="call-engineer" id="call-engineer" 
                        className="mt-1 h-5 w-5 border-2 border-white/30 
                          data-[state=checked]:border-eythor-blue data-[state=checked]:bg-eythor-blue
                          transition-all duration-300" />
                      <div className="flex-1">
                        <Label htmlFor="call-engineer" className="text-white cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-eythor-blue/10 flex items-center justify-center">
                              <Zap className="w-4 h-4 text-eythor-blue" />
                            </div>
                            <div>
                              <div className="font-semibold text-base">Schedule a call with our engineer</div>
                            </div>
                          </div>
                          <p className="text-sm text-white/50 mt-2 ml-0">Our expert will visit your site, assess your solar panel setup, and provide a customized recommendation</p>
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 group
                      ${field.value === 'self-provide' 
                        ? 'bg-eythor-blue/10 border-eythor-blue/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'}`}
                    onClick={() => field.onChange('self-provide')}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value="self-provide" id="self-provide" 
                        className="mt-1 h-5 w-5 border-2 border-white/30 
                          data-[state=checked]:border-eythor-blue data-[state=checked]:bg-eythor-blue
                          transition-all duration-300" />
                      <div className="flex-1">
                        <Label htmlFor="self-provide" className="text-white cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-eythor-blue/10 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-eythor-blue" />
                            </div>
                            <div>
                              <div className="font-semibold text-base">I'll provide my solar panel details</div>
                            </div>
                          </div>
                          <p className="text-sm text-white/50 mt-2 ml-0">Enter your panel specifications and roof details for an instant preliminary quote</p>
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={prevStep} 
            className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button type="submit" className="cta-button group gap-2" disabled={isSubmitting}>
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </form>
    );
  };

  const renderStep3Commercial = () => (
    <div className="text-center py-8">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-eythor-blue/20 to-eythor-blue/5 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="h-12 w-12 text-eythor-blue" />
      </div>
      
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-4">
        <Building2 className="w-3.5 h-3.5 text-eythor-blue" />
        <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Commercial</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        <span className="text-gradient-blue">Thank You!</span>
      </h2>

      <div className="max-w-lg mx-auto">
        <p className="text-white/60 mb-8 leading-relaxed">
          For warehouse and solar farm installations, our engineering team needs to conduct a detailed site assessment. We will contact you within 24 hours to discuss your project requirements and schedule a consultation.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={prevStep} variant="outline" 
          className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300">
          <ArrowLeft className="w-4 h-4" />
          Back to Form
        </Button>
        <Button onClick={() => handleFinalSubmit()} className="cta-button group gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <span>Submit Request</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep4PanelDetails = () => {
    return (
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-5">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-eythor-blue/10 rounded-full mb-4">
            <Sun className="w-3.5 h-3.5 text-eythor-blue" />
            <span className="text-xs font-medium text-eythor-blue tracking-wider uppercase">Panel Details</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-blue">Solar Panel Specs</span>
          </h2>
          <p className="text-white/50 text-sm">Provide your panel specifications for an accurate quote</p>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="panelType"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-white/80 text-sm font-medium">Panel Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/[0.03] border-white/10 text-white 
                      focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                      transition-all duration-300 rounded-lg h-11 hover:border-white/20">
                      <SelectValue placeholder="Select panel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                    {panelTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white/70 hover:text-white focus:text-white focus:bg-eythor-blue/10">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="panelCount"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-white/80 text-sm font-medium">Number of Panels *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 20" {...field} 
                    className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                      focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                      transition-all duration-300 rounded-lg h-11 hover:border-white/20" />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roofType"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-white/80 text-sm font-medium">Roof Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/[0.03] border-white/10 text-white 
                      focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                      transition-all duration-300 rounded-lg h-11 hover:border-white/20">
                      <SelectValue placeholder="Select roof type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                    {roofTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white/70 hover:text-white focus:text-white focus:bg-eythor-blue/10">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roofAngle"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-white/80 text-sm font-medium">Roof Angle *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/[0.03] border-white/10 text-white 
                      focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                      transition-all duration-300 rounded-lg h-11 hover:border-white/20">
                      <SelectValue placeholder="Select roof angle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                    {roofAngleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white/70 hover:text-white focus:text-white focus:bg-eythor-blue/10">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shading"
          render={({ field }) => (
            <FormItem className="group">
              <FormLabel className="text-white/80 text-sm font-medium">Shading Condition *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/[0.03] border-white/10 text-white 
                    focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                    transition-all duration-300 rounded-lg h-11 hover:border-white/20">
                    <SelectValue placeholder="Select shading condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-black/95 border-white/10 backdrop-blur-xl">
                  {shadingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white/70 hover:text-white focus:text-white focus:bg-eythor-blue/10">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem className="group">
              <FormLabel className="text-white/80 text-sm font-medium">Additional Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any specific requirements, access constraints, or additional information..." {...field} rows={3} 
                  className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 
                    focus:border-eythor-blue/50 focus:ring-1 focus:ring-eythor-blue/20 
                    transition-all duration-300 rounded-lg hover:border-white/20 resize-none" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={prevStep} 
            className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-2 transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button type="submit" className="cta-button group gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <span>Get Quote</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Background video behind the form */}
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <VideoBackground src="/lovable-uploads/landing.mp4" className="h-full" />
        </div>
        
        {/* Decorative tech shapes */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-eythor-blue/5 rounded-full blur-[100px] animate-pulse pointer-events-none z-[1]"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px] animate-pulse pointer-events-none z-[1]" style={{ animationDelay: '1s' }}></div>
        
        <main className="relative z-10 pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-2xl">
            {/* Step Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-center gap-0">
                  {[
                    { num: 1, label: 'Details', key: 1 },
                    { num: 2, label: step === 2 ? 'Choice' : step === 3 ? 'Review' : 'Specs', key: 2 },
                    { num: 3, label: 'Submit', key: 3 },
                  ].map((item, index) => {
                    const isActive = 
                      (item.num === 1 && step >= 1) ||
                      (item.num === 2 && (step === 2 || step === 3 || step === 4)) ||
                      (item.num === 3 && (step === 3 || step === 4));
                    const isCompleted = 
                      (item.num === 1 && step > 1) ||
                      (item.num === 2 && step > 2) ||
                      (item.num === 3 && step > 3);

                    return (
                      <React.Fragment key={item.key}>
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-eythor-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                              : isActive
                                ? 'bg-eythor-blue/20 border-2 border-eythor-blue/50 text-eythor-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                                : 'bg-white/5 border border-white/10 text-white/40'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              item.num
                            )}
                          </div>
                          <span className={`text-xs mt-1.5 font-medium transition-colors duration-300 ${
                            isActive ? 'text-eythor-blue' : 'text-white/40'
                          }`}>
                            {item.label}
                          </span>
                        </div>
                        {index < 2 && (
                          <div className={`w-20 h-0.5 mx-2 mt-[-1.25rem] rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-eythor-blue shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'bg-white/10'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

            {/* Form Card */}
            <div className="relative group">
              {/* Glow effect behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-eythor-blue/20 via-transparent to-eythor-blue/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl hover:border-white/20 transition-all duration-300">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-eythor-blue/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
                
                <div className="relative z-10">
                  <FormProvider {...form}>
                    <Form {...form}>
                      {step === 1 && renderStep1()}
                      {step === 2 && renderStep2Household()}
                      {step === 3 && renderStep3Commercial()}
                      {step === 4 && renderStep4PanelDetails()}
                    </Form>
                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default SolarQuote;