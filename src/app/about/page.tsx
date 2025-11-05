import Image from 'next/image';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { services } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';

export const metadata: Metadata = {
  title: 'About Me',
};

const aboutUsHeroImage = placeholderImages.placeholderImages.find((p) => p.id === 'about-us-hero');

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[50vh] flex items-center justify-center text-center text-white">
          {aboutUsHeroImage && (
            <Image
              src={aboutUsHeroImage.imageUrl}
              alt={aboutUsHeroImage.description}
              fill
              className="object-cover"
              data-ai-hint={aboutUsHeroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-primary/80" />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline">
              About Felafrika Technologies
            </h1>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-primary-foreground/80">
              I am a passionate creator, thinker, and developer dedicated to building the future of
              digital experiences in Africa and beyond.
            </p>
          </div>
        </section>

        {/* Mission and Values */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                  My Mission
                </h2>
                <p className="text-lg text-muted-foreground">
                  My mission is to empower businesses and individuals through innovative technology.
                  I believe in crafting digital solutions that are not only powerful and efficient
                  but also beautiful and a joy to use. I strive to be a catalyst for growth and a
                  trusted partner for my clients on their digital journey.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                  My Values
                </h2>
                <ul className="space-y-2 text-lg text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-accent font-bold mr-2">✓</span>{' '}
                    <strong>Innovation:</strong> Constantly exploring new technologies and ideas.
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent font-bold mr-2">✓</span>{' '}
                    <strong>Integrity:</strong> Upholding transparency and honesty in all I do.
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent font-bold mr-2">✓</span>{' '}
                    <strong>Collaboration:</strong> Working closely with my clients as one team.
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent font-bold mr-2">✓</span>{' '}
                    <strong>Excellence:</strong> Committing to the highest standards of quality.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                My Services
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                I offer a comprehensive suite of services to transform your ideas into reality.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <Card key={service.title} className="text-center">
                  <CardHeader>
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full">
                      {service.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <p className="mt-2 text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
