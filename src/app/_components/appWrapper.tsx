"use server";

import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export default async function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (await api.user.noUsers()) {
    redirect("/setup");
  }

  return <>{children}</>;
}
