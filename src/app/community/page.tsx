import { CommunityProject, getCommunityProjects } from "@/lib/community-projects";
import { CommunityDirectory } from "@/components/community-directory";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  let projects: CommunityProject[] = [];
  let loadError: string | null = null;

  try {
    projects = await getCommunityProjects();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Failed to load community projects.";
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tighter text-zinc-100">
          Community Directory
        </h1>
        <p className="text-sm text-zinc-500 mt-1.5 max-w-[65ch]">
          Tools, apps, and resources built by the Mezo community.
        </p>
      </header>
      {loadError ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {loadError}
        </div>
      ) : (
        <CommunityDirectory projects={projects} />
      )}
    </div>
  );
}
