import { prisma } from "@/lib/prisma";

function escapeCSV(value: any) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      country: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  const headers = [
    "ID",
    "Name",
    "Email",
    "Role",
    "Status",
    "Phone",
    "Country",
    "Last Login",
    "Created At",
  ];

  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.role,
    user.status,
    user.phone || "",
    user.country || "",
    user.lastLogin ? new Date(user.lastLogin).toLocaleString("en-GB") : "",
    new Date(user.createdAt).toLocaleString("en-GB"),
  ]);

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=admin-users.csv`,
    },
  });
}