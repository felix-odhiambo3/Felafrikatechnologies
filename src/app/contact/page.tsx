import { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Me',
  description: 'Get in touch with Felafrika Technologies.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">Contact Me</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Have a project in mind or just want to say hello? I'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="bg-card p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6 font-headline">Send me a Message</h2>
          <ContactForm />
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 font-headline">My Information</h2>
            <p className="text-muted-foreground mb-6">
              You can also reach me through the following channels.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Email</h3>
              <p className="text-muted-foreground">General Inquiries</p>
              <a
                href="mailto:felafrikasoftware.engineer@yahoo.com"
                className="text-primary hover:text-accent transition-colors"
              >
                felafrikasoftware.engineer@yahoo.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Phone</h3>
              <p className="text-muted-foreground">Mon-Fri from 9am to 5pm</p>
              <a
                href="tel:+254748809701"
                className="text-primary hover:text-accent transition-colors"
              >
                +254 748 809 701
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Office</h3>
              <p className="text-muted-foreground">Karen, Nairobi, Kenya</p>
              <a href="#" className="text-primary hover:text-accent transition-colors">
                View on map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
