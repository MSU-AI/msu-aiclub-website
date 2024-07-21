import { ProjectSubmissionForm } from './projectSubmissionForm';

export default function SubmitProjectPage() {
  return (
    <div className="max-w-[1024px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Submit a New Project</h1>
      <ProjectSubmissionForm />
    </div>
  );
}
