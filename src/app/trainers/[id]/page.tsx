import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { TrainerProfileView } from "@/components/trainers/trainer-profile-view";

export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function TrainerProfilePage({ params }: PageProps) {
  const trainer = await dbService.getTrainerById(params.id);

  if (!trainer) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  let userPurchases: any[] = [];
  if (session?.user?.id) {
    userPurchases = await dbService.getUserPurchases(session.user.id);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TrainerProfileView
            trainer={trainer}
            userPurchases={userPurchases}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
