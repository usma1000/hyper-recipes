import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { checkRole } from "~/utils/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  // Check if user is authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  // Verify admin status
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 p-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-300">
            You have special privileges to manage the application
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
}
