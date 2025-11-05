import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Code, Smartphone, Cloud, PenTool, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { projects, testimonials, services } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import placeholderImages from '@/lib/placeholder-images.json';

const heroImage = placeholderImages.placeholderImages.find((p) => p.id === 'hero-background');

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-primary/80" />
          <div className="relative z-10 p-4 sm:p-6 md:p-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Innovate. Create. Elevate.
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg md:text-xl text-primary-foreground/80">
              I craft bespoke digital solutions that drive growth and inspire users.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="#projects">View My Work</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-primary"
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="services" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                My Expertise
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                I provide a wide range of services to bring your vision to life.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div key={service.title} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full">
                    {service.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-2 text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                My Work
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A selection of projects that showcase my skills and dedication.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg" variant="link" className="text-accent hover:text-accent/90">
                <Link href="/projects">
                  View All Projects <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                What My Clients Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                I am proud to have earned the trust of my clients.
              </p>
            </div>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full max-w-4xl mx-auto mt-12"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => {
                  const testimonialImage = placeholderImages.placeholderImages.find(
                    (p) => p.id === testimonial.imageId,
                  );
                  return (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                        <Card className="flex flex-col h-full">
                          <CardHeader className="flex-grow">
                            <div className="flex mb-4">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 text-accent fill-current" />
                              ))}
                            </div>
                            <CardDescription className="text-foreground">
                              "{testimonial.quote}"
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="flex items-center gap-4">
                            {testimonialImage && (
                              <Image
                                src={testimonialImage.imageUrl}
                                alt={`Avatar of ${testimonial.name}`}
                                width={40}
                                height={40}
                                className="rounded-full"
                                data-ai-hint={testimonialImage.imageHint}
                              />
                            )}
                            <div>
                              <p className="font-semibold">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </section>
      </main>
    </div>
  );
}
