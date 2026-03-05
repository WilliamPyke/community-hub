import { communityProjects } from "@/lib/data";
import { CommunityDirectory } from "@/components/community-directory";

export default function CommunityPage() {
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
      <CommunityDirectory projects={communityProjects} />
    </div>
  );
}
