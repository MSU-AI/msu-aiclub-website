import Link from "next/link"

export default function PostCard({ post }: any) {
    return (
        <Link href={`/posts/${post.id}`}>
            <div className="flex flex-col bg-white rounded-md p-3" key={post.id}>
                <div className="flex flex-row gap-5 items-center justify-start">
                    <img src={post.profilePic} alt="profile pic" className="w-[50px] h-[50px] rounded-full" />
                    <p className="text-xl font-bold">{post.author}</p>
                </div>
                <p className="text-xl font-bold">{post.name}</p>
                <p className="text-gray-500">{post.description}</p>
            </div>
        </Link>
    )
}