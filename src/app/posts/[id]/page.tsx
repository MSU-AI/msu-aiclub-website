import { getPostById } from '~/server/db/queries/posts';
import ReactMarkdown from 'react-markdown';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";

type PostData = {
  id: string;
  title: string;
  description: string;
  content: string;
  likes: number;
  thumbnailUrl: string | null;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    fullName?: string;
  } | null;
  liked: boolean;
  commentCount: number;
};

export default async function PostView({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id) as PostData | null;

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            By {post.user?.fullName || 'AI Club'} on {new Date(post.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReactMarkdown className="prose max-w-none">
            {post.content}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}
