import { Metadata } from 'next';
import { projects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';

export const metadata: Metadata = {
  title: 'My Work',
  description: 'Explore a selection of my finest projects.',
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">My Work</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          I take pride in my craft. Explore a selection of projects that demonstrate my commitment
          to excellence and innovation.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
