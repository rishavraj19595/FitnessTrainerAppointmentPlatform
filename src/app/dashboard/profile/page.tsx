import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { ProfileFormView } from "@/components/dashboard/profile-form-view";

export const revalidate = 0;

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/dashboard/profile");
  }

  const user = await dbService.getUserById(session.user.id);

  return <ProfileFormView user={user} />;
}
