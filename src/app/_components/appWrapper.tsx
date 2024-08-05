"use server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (await api.user.noUsers()) {
    redirect("/setup");
  }

  if (!session) {
    redirect("/api/auth/signin");
  }
  return <>{children}</>;
}
