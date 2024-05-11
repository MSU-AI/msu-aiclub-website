import { createClient } from "~/utils/supabase/server";

export default async function MemberPage() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    return (
        <div>
            Hello {data?.user?.email}
        </div>
    )
}