"use server";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import SetupForm from "../_components/forms/setupForm";
import Card from "../_components/ui/card";

export default async function Setup() {
  if (!(await api.user.noUsers())) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-14">
      <Card>
        <h1 className="text-xl">Create account</h1>
        <SetupForm />
      </Card>
    </main>
  );
}
