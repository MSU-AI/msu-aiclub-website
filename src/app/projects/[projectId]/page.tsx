import Image from 'next/image';
import { getProjectById } from '~/server/db/queries/projects';
import { Button } from "~/components/ui/button";
import { GlobeIcon, GitHubLogoIcon, LinkedInLogoIcon, GlobeIcon as PersonalSiteIcon } from "@radix-ui/react-icons";
import '~/app/posts/create/postStyles.css'; // Reuse the styles from the post page
import Link from 'next/link';
import { Footer } from '~/components/landing/footer';
import { Tag } from '~/components/ui/tag';


function getYouTubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2]?.length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

export default async function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const project = await getProjectById(params.projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  const embedUrl = project.videoUrl ? getYouTubeEmbedUrl(project.videoUrl) : null;

  console.log(project)

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4 pt-28">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      
      {embedUrl ? (
        <div className="mb-6 w-[1024] h-[576px] ">
          <iframe 
            src={embedUrl} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      ) : project.thumbnailUrl && typeof project.thumbnailUrl === 'string' ? (
        <div className="mb-6">
          <Image 
            src={project.thumbnailUrl} 
            alt={project.name || 'Project thumbnail'}
            width={800}
            height={450}
            className="rounded-lg object-cover"
          />
        </div>
      ) : (
        <div className="mb-6 h-[450px] w-full bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No preview available</p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {project.projectSkills.map((skill, index) => (
          <Tag 
            key={index} 
            text={skill.skillName}
            colorIndex={index}
          />
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
        className="prose prose-lg prose-invert max-w-none custom-html-content !text-foreground mb-6"
        dangerouslySetInnerHTML={{ __html: project.description }}
      />

     <h2 className="text-2xl font-bold mb-4">Project Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {project.userProjects.map((member) => (
          <div key={member?.id} className="relative group">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              {member?.raw_user_meta_data?.flowerProfile ? (
                <Image 
                  src={member.raw_user_meta_data.flowerProfile}
                  alt={member?.raw_user_meta_data?.full_name || 'Team member'} 
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">No image</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white text-center">
                  <p className="font-bold">{member?.raw_user_meta_data?.full_name}</p>
                  <p>{member?.role}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {member?.raw_user_meta_data?.linkedinUrl && (
                <Button size="icon" variant="secondary" asChild >
                  <Link href={member?.raw_user_meta_data?.linkedinUrl} >
                    <LinkedInLogoIcon className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {member?.raw_user_meta_data?.githubUrl && (
                <Button size="icon" variant="secondary" asChild>
                  <Link  href={member?.raw_user_meta_data?.githubUrl} >
                    <GitHubLogoIcon className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {member?.raw_user_meta_data?.personalWebsite && (
                <Button size="icon" variant="secondary" asChild >
                  <Link href={member?.raw_user_meta_data?.personalWebsite} >
                   <PersonalSiteIcon className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
