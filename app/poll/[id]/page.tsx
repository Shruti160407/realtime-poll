import { prisma } from "@/lib/prisma";
import VoteOptions from "./VoteOptions";
import ShareButtons from "./ShareButtons";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PollPage({ params }: PageProps) {
  const { id } = await params;

  const poll = await prisma.poll.findUnique({
    where: { id },
    include: {
      options: {
        include: {
          votes: true,
        },
      },
    },
  });

  if (!poll) {
    return <div>Poll not found</div>;
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{poll.question}</h1>

      <ShareButtons />


      <VoteOptions pollId={poll.id} options={poll.options} />
    </main>
  );
}
