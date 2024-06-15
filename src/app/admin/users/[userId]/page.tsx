import { getUserById } from "~/server/db/queries/users";

export default async function UserView({ 
    params 
}: { 
    params: {
        userId: string
    }
}) {
    const user = await getUserById(params.userId);

    return (
        <div className="flex flex-col justify-center items-start w-100">
            <p>{`User: ${user?.id}`}</p>
            <p>Projects</p>
            <div className="flex flex-row justify-between items-center">
                {user?.projects?.map((project) => (
                    <div key={project.project.id} className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <div className="text-lg">{project.project.name}</div>
                            <div className="text-sm">{project.project.description}</div>
                        </div>
                    </div>
                ))} 
            </div>
            <p>Posts</p>
            <div className="flex flex-row justify-between items-center">
                {user?.posts?.map((post) => (
                    <div key={post.id} className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <div className="text-lg">{post.title}</div>
                            <div className="text-sm">{post.description}</div>
                            <div className="text-sm">{post.content}</div>
                        </div>
                    </div>
                ))} 
            </div>
            <p>Comments</p>
            <div className="flex flex-row justify-between items-center">
                {user?.comments?.map((comment) => (
                    <div key={comment.id} className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <div className="text-lg">{comment.content}</div>
                        </div>
                    </div>
                ))} 
            </div>
            <p>Roles</p>
            <div className="flex flex-row justify-between items-center">
                {user?.roles?.map((role) => (
                    <div key={role.role.id} className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <div className="text-lg">{role.role.name}</div>
                        </div>
                    </div>
                ))} 
            </div>
        </div>
    );
}