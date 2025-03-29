import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="py-8">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Management Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">User Management</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/users/points"
                className="text-blue-600 hover:underline"
              >
                Manage User Points
              </Link>
            </li>
            {/* Add more user management links as needed */}
          </ul>
        </div>

        {/* Add more admin section cards as needed */}
      </div>
    </div>
  );
}
