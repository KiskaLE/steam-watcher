"use server";
import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await validateRequest();
  if (await api.user.noUsers()) {
    redirect("/setup");
  }

  if (!session) {
    redirect("/login");
  }
  return <>{children}</>;
}
