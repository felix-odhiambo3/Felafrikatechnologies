import { Metadata } from 'next';
import { ProjectSuggester } from '@/components/project-suggester';
import { Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Project Suggester',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AiProjectSuggesterPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <Lightbulb className="mx-auto h-12 w-12 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          AI Project Suggester
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Upload images of a project, and our AI will generate compelling descriptions for your
          portfolio. This tool helps kickstart your case study writing process.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ProjectSuggester />
      </div>
    </div>
  );
}
