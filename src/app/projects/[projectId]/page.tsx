import Image from 'next/image';
import { getProjectById } from '~/server/db/queries/projects';
import { Button } from "~/components/ui/button";
import { GlobeIcon, GitHubLogoIcon, LinkedInLogoIcon, GlobeIcon as PersonalSiteIcon } from "@radix-ui/react-icons";
import '~/app/posts/create/postStyles.css'; // Reuse the styles from the post page
import Link from 'next/link';

const TAG_COLORS = [
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800',
  'bg-red-200 text-red-800',
  'bg-purple-200 text-purple-800',
];

// Dummy data for team members
const dummyTeamMembers = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Project Lead',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    personalSite: 'https://johndoe.com'
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Developer',
    profilePicture: 'https://i.pravatar.cc/150?img=2',
    linkedin: 'https://linkedin.com/in/janesmith',
    github: 'https://github.com/janesmith',
  },
  // Add more dummy team members as needed
];

function getYouTubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

export default async function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const project = await getProjectById(params.projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  const embedUrl = project.videoUrl ? getYouTubeEmbedUrl(project.videoUrl) : null;

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      
      {embedUrl ? (
        <div className="mb-6 aspect-w-16 aspect-h-9">
          <iframe 
            src={embedUrl} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      ) : project.thumbnailUrl ? (
        <div className="mb-6">
          <Image 
            src={project.thumbnailUrl} 
            alt={project.name}
            width={800}
            height={450}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      ) : null}

      <div className="mb-6">
        {project.skills.map((skill, index) => (
          <span 
            key={index} 
            className={`inline-block ${TAG_COLORS[index % TAG_COLORS.length]} px-2 py-1 rounded-full text-sm mr-2 mb-2`}
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex space-x-4 mb-6">
        {project.liveSiteUrl && (
          <Button asChild >
            <Link href={project.liveSiteUrl} >
            <GlobeIcon className="mr-2 h-4 w-4" /> Live Site
            </Link>
          </Button>
        )}
        {project.githubUrl && (
          <Button asChild >
            <Link href={project.githubUrl}>
            <GitHubLogoIcon className="mr-2 h-4 w-4" /> GitHub
            </Link>
          </Button>
        )}
      </div>

      <div 
        className="prose prose-lg prose-invert max-w-none custom-html-content mb-6"
        dangerouslySetInnerHTML={{ __html: project.description }}
      />

     <h2 className="text-2xl font-bold mb-4">Project Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyTeamMembers.map((member) => (
          <div key={member.id} className="relative group">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <Image 
                src={member.profilePicture} 
                alt={member.name} 
                layout="fill" 
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white text-center">
                  <p className="font-bold">{member.name}</p>
                  <p>{member.role}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {member.linkedin && (
                <Button size="icon" variant="secondary" asChild >
                  <Link href={member.linkedin} >
                    <LinkedInLogoIcon className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {member.github && (
                <Button size="icon" variant="secondary" asChild>
                  <Link  href={member.github} >
                    <GitHubLogoIcon className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {member.personalSite && (
                <Button size="icon" variant="secondary" asChild >
                  <Link href={member.personalSite} >
                   <PersonalSiteIcon className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
