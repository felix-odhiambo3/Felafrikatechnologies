import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const projectImage = placeholderImages.placeholderImages.find((p) => p.id === project.imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/projects/${project.slug}`} className="block">
          <div className="aspect-video relative">
            {projectImage ? (
              <Image
                src={projectImage.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={projectImage.imageHint}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="text-xl font-semibold mb-2">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent transition-colors">
            {project.title}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 p-6 pt-0">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
