import { createClient } from "~/utils/supabase/server";
import PostForm from "./postForm";

export default async function NewPostPage() {
    const supaBase = createClient();

    const { data } = await supaBase.auth.getUser();

    return (
        <div>
            <PostForm supaId={data?.user?.id} />
        </div>
    )
}