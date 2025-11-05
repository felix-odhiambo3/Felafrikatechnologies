import { Code, Smartphone, Cloud, PenTool, type LucideIcon } from 'lucide-react';
import React from 'react';

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  imageId: string;
  tags: string[];
  challenge: string;
  solution: string;
  results: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  quote: string;
  imageId: string;
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactElement;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'chipukizi-vod-cooperative',
    title: 'Chipukizi VOD Cooperative System',
    description:
      'A web application to automate and optimize simulation processes for a cooperative society.',
    longDescription:
      'Engineered a comprehensive web application for Chipukizi VOD Cooperative Society to automate and optimize their simulation processes. The system was designed to handle hundreds of concurrent simulations, manage over a thousand daily tasks, and provide deep insights into user activity and performance.',
    imageId: 'project-chipukizi',
    tags: ['Web Application', 'Flask', 'React.js', 'System Architecture'],
    challenge:
      'The primary challenge was to build a highly performant system capable of handling over 200 concurrent simulations and 1,000+ daily tasks without performance degradation. The society also needed a way to visualize user activity and track project performance effectively to enable data-driven decision-making.',
    solution:
      'I architected a robust backend using Flask and PostgreSQL, which improved system performance and data retrieval efficiency. For the frontend, an interactive dashboard was developed with React.js, providing managers with enhanced visibility into user activity and performance across more than 300 projects.',
    results: [
      'Achieved a 40% improvement in system performance and data retrieval.',
      'Boosted operational efficiency by 30% through automation.',
      'Empowered managers to make data-driven decisions with a new interactive dashboard.',
      'Streamlined management for a system handling over 1,000 tasks daily.',
    ],
  },
  {
    id: 2,
    slug: 'chini-ya-dari-portfolio',
    title: 'Chini ya Dari Digital Portfolio',
    description:
      'A dynamic web application and digital marketing platform for a videography and photography firm.',
    longDescription:
      'A dynamic web application built for Chini ya Dari Limited, a videography and photography firm, to enhance their digital marketing and client engagement. The project involved creating an interactive online portfolio with a focus on media showcasing, SEO, and content management.',
    imageId: 'project-chini-ya-dari',
    tags: ['Web Development', 'Digital Marketing', 'SEO', 'CMS'],
    challenge:
      'The firm needed to improve its online presence and client engagement. Their existing portfolio was not effectively showcasing their high-resolution work, and the marketing team lacked an easy way to update content, manage bookings, and track digital marketing performance.',
    solution:
      'I developed a dynamic web application featuring a seamless media showcase for high-resolution videos and photo galleries. SEO optimization, analytics tracking, and social media automation were integrated to boost traffic. An intuitive content management interface was also built, allowing the team to easily manage projects and bookings without technical help.',
    results: [
      'Increased website traffic by 45% through SEO and social media integration.',
      'Improved client conversion rates with a more engaging portfolio.',
      'Enabled the marketing team to self-manage content, blogs, and bookings.',
      'Ensured fast content delivery and scalability using a Flask and PostgreSQL backend.',
    ],
  },
  {
    id: 3,
    slug: 'training-ai-model',
    title: 'Training of AI Model',
    description:
      'An end-to-end training workflow for a supervised learning model demonstrating linear regression techniques.',
    longDescription:
      'Implemented a complete training pipeline focused on linear regression. The project demonstrates data preprocessing, model training, evaluation, and deployment considerations using practical datasets. It serves as a tutorial-style project showcasing how to build and assess simple predictive models.',
    imageId: 'project-linear',
    tags: ['Machine Learning', 'AI', 'Regression', 'Tutorial'],
    challenge:
      'Design a straightforward and reproducible training workflow that demonstrates linear regression concepts and produces an explainable model with measurable performance.',
    solution:
      'Built a step-by-step pipeline for data cleaning, feature engineering, training and evaluating a linear regression model. Provided clear documentation and example notebooks so users can reproduce experiments and explore hyperparameter impacts.',
    results: [
      'Delivered an educational, reproducible linear regression training pipeline.',
      'Included example Colab notebook for hands-on experimentation.',
      'Provided clear metrics and visualization to explain model performance.',
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Kofi Annan Jr.',
    company: 'CEO of AfroWears',
    quote:
      'Felafrika Technologies delivered beyond my expectations. His expertise and dedication were instrumental in launching our platform successfully. He is a true partner in innovation.',
    imageId: 'testimonial-kofi',
  },
  {
    id: 2,
    name: 'Amina Yusuf',
    company: 'Product Manager at PesaFlow',
    quote:
      'The attention to detail in both design and security was remarkable. Felix created an app that our users love and trust. His collaborative process made a complex project feel easy.',
    imageId: 'testimonial-amina',
  },
  {
    id: 3,
    name: 'Samuel Chen',
    company: 'Operations Director at TransitKE',
    quote:
      'The logistics platform has transformed our operations. We are more efficient, our clients are happier, and our costs are down. Felafrika Technologies understood our unique challenges and built a perfect solution.',
    imageId: 'testimonial-samuel',
  },
];

export const services: Service[] = [
  {
    title: 'Web Development',
    description:
      'Crafting responsive, high-performance websites and web applications tailored to your business goals.',
    icon: React.createElement(Code),
  },
  {
    title: 'Mobile App Development',
    description:
      'Building beautiful and intuitive native and cross-platform mobile apps for iOS and Android.',
    icon: React.createElement(Smartphone),
  },
  {
    title: 'UI/UX Design',
    description:
      'Designing user-centric interfaces that provide engaging and memorable digital experiences.',
    icon: React.createElement(PenTool),
  },
  {
    title: 'Cloud Solutions',
    description:
      'Leveraging the power of the cloud to build scalable, secure, and resilient infrastructure and applications.',
    icon: React.createElement(Cloud),
  },
];
