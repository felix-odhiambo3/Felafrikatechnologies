import { Metadata } from 'next';
import {
  Download,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Mail,
  Phone,
  Github,
  Linkedin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Felix Odhiambo - Resume',
  description:
    'The professional resume of Felix Odhiambo, a passionate and creative Software Engineer.',
};

const professionalSummary =
  'A passionate and creative Software Engineer with a knack for crafting beautiful and functional user experiences. I thrive on turning complex problems into simple, elegant solutions and am constantly exploring new technologies.';

const experiences = [
  {
    role: 'Web development intern',
    company: 'Chipukizi VOD Cooperative Society',
    period: 'May 2025 – Current',
    description:
      'Architected a robust backend using Flask and PostgreSQL to handle over 200 concurrent simulations, resulting in a 40% improvement in system performance and data retrieval efficiency. Developed an interactive React.js dashboard that enhanced visibility into user activity and performance tracking, empowering managers to make data-driven decisions across 300+ projects. Streamlined task management for a system handling over 1,000 tasks daily. Engineered a web application that automated and optimized simulation processes for Chipukizi VOD Cooperative Society, achieving a 30% boost in operational efficiency and improved coordination among project teams.',
    tags: ['Flask', 'PostgreSQL', 'React.js', 'System Performance'],
  },
  {
    role: 'Web Development and Digital Marketing Optimization',
    company: 'Chini ya Dari Limited',
    period: 'Jun 2025 – Jul 2025',
    description:
      'Developed a dynamic web application for Chini ya Dari Limited, a videography and photography firm, to enhance digital marketing and client engagement through an interactive online portfolio. Implemented media showcase features that allow seamless display of high-resolution videos and photo galleries, improving client visibility and portfolio accessibility across devices. Integrated SEO optimization, analytics tracking, and social media automation, resulting in a 45% increase in website traffic and improved client conversion rates. Built an intuitive content management interface enabling the marketing team to easily update projects, publish blogs, and manage bookings without technical assistance. Optimized backend performance using Flask and PostgreSQL, ensuring fast content delivery and scalability for growing client demands.',
    tags: ['Flask', 'PostgreSQL', 'SEO', 'Digital Marketing', 'React.js'],
  },
];

const education = [
  {
    degree: 'B.Sc. in Software Engineering',
    institution: 'Cooperative University of Kenya',
    period: 'Sep 2022 - Sep 2026',
    details:
      'Currently studying Artificial Intelligence, Machine Learning, Database Systems, Software Design, and Web Application Development. Coursework integrates AI-driven software solutions, data processing, and system optimization, aligning with practical projects such as the Chipukizi VOD Cooperative System and Natural Language to SQL Converter.',
  },
];

const skills = [
  { name: 'Python', level: 'Expert' },
  { name: 'JavaScript', level: 'Expert' },
  { name: 'HTML/CSS', level: 'Expert' },
  { name: 'Java', level: 'Intermediate' },
  { name: 'C', level: 'Intermediate' },
  { name: 'React.js', level: 'Advanced' },
  { name: 'Tailwind CSS', level: 'Advanced' },
  { name: 'Node.js', level: 'Advanced' },
  { name: 'Flask', level: 'Expert' },
  { name: 'Springboot', level: 'Intermediate' },
  { name: 'Django', level: 'Advanced' },
  { name: 'PostgreSQL', level: 'Expert' },
  { name: 'MySQL', level: 'Advanced' },
  { name: 'MongoDB', level: 'Intermediate' },
  { name: 'Docker', level: 'Advanced' },
  { name: 'GitHub Actions', level: 'Advanced' },
  { name: 'TensorFlow', level: 'Intermediate' },
  { name: 'PyTorch', level: 'Intermediate' },
];

export default function ResumePage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            Felix Odhiambo
          </h1>
          <p className="mt-2 text-xl text-muted-foreground font-medium">Software Engineer</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:felafrikasoftware.engineer@yahoo.com" className="hover:text-accent">
                felafrikasoftware.engineer@yahoo.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+254748809701" className="hover:text-accent">
                +254 748 809 701
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <a
                href="https://github.com/felix-odhiambo3"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                github.com/felix-odhiambo3
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              <a
                href="https://linkedin.com/in/felix-odhiambo/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                linkedin.com/in/felix-odhiambo
              </a>
            </div>
          </div>
        </div>
        <a
          href="/Resume.pdf"
          download="Felix_Odhiambo_Resume.pdf"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'bg-accent text-accent-foreground hover:bg-accent/90 mt-4 sm:mt-0',
          )}
        >
          <Download className="mr-2 h-5 w-5" />
          Download PDF
        </a>
      </header>

      <div className="grid gap-16">
        {/* Professional Summary */}
        <section>
          <h2 className="text-3xl font-bold font-headline mb-6 flex items-center">
            <Award className="mr-3 h-8 w-8 text-accent" /> Professional Summary
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{professionalSummary}</p>
        </section>

        {/* Work Experience */}
        <section>
          <h2 className="text-3xl font-bold font-headline mb-8 flex items-center">
            <Briefcase className="mr-3 h-8 w-8 text-accent" /> Projects And Experience
          </h2>
          <div className="space-y-12 relative border-l-2 border-accent/20 pl-10">
            {experiences.map((exp, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[48px] top-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center ring-8 ring-background">
                  <Briefcase className="h-3 w-3 text-accent-foreground" />
                </div>
                <p className="text-sm font-semibold text-accent">{exp.period}</p>
                <h3 className="text-2xl font-semibold mt-1">{exp.role}</h3>
                <p className="text-lg text-muted-foreground font-medium">{exp.company}</p>
                <p className="mt-3 text-foreground/80">{exp.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-3xl font-bold font-headline mb-8 flex items-center">
            <GraduationCap className="mr-3 h-8 w-8 text-accent" /> Education
          </h2>
          <div className="space-y-8">
            {education.map((edu, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{edu.degree}</CardTitle>
                      <CardDescription className="text-base">{edu.institution}</CardDescription>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{edu.period}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{edu.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-3xl font-bold font-headline mb-8 flex items-center">
            <Code className="mr-3 h-8 w-8 text-accent" /> Technical Skills
          </h2>
          <Card>
            <CardContent className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-foreground">{skill.name}</h4>
                    <p className="text-sm text-muted-foreground">{skill.level}</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div
                      className="bg-accent h-2.5 rounded-full"
                      style={{
                        width:
                          skill.level === 'Expert'
                            ? '100%'
                            : skill.level === 'Advanced'
                              ? '80%'
                              : '60%',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
