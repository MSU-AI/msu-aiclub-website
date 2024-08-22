import { getUsers } from '~/server/db/queries/user';
import { ProjectSubmissionForm } from './projectSubmissionForm';
import { createClient } from '~/utils/supabase/server';

export default async function SubmitProjectPage() {
  const users = await getUsers();
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    return <div>You must be logged in to submit a project</div>;
  }

  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8 pt-28">
      <h1 className="text-2xl font-bold mb-4">Submit a New Project</h1>
      <ProjectSubmissionForm users={users} user={user.user} />
    </div>
  );
}
