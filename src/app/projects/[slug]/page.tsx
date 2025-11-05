import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { projects } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

// ✅ Correct typing for dynamic routes in Next.js 15+
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const projectImage = placeholderImages.placeholderImages.find(
    (p) => p.id === project.imageId
  );

  return (
    <article className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <div className="flex justify-center gap-2 mb-4">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          {project.title}
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          {project.description}
        </p>
      </div>

      <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg mb-16">
        {projectImage && (
          <Image
            src={projectImage.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority
            data-ai-hint={projectImage.imageHint}
          />
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-foreground prose-a:text-accent hover:prose-a:text-accent/80">
          <p>{project.longDescription}</p>

          <div className="grid md:grid-cols-2 gap-12 my-16 bg-secondary p-8 rounded-lg">
            <div>
              <h2 className="!mt-0">The Challenge</h2>
              <p>{project.challenge}</p>
            </div>
            <div>
              <h2 className="!mt-0">The Solution</h2>
              <p>{project.solution}</p>
            </div>
          </div>

          <div>
            <h2>Results & Impact</h2>
            <ul className="space-y-4">
              {project.results.map((result, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
