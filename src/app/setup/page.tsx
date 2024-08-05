"use server";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import SetupForm from "../_components/forms/setupForm";

export default async function Setup() {
  if (!(await api.user.noUsers())) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-14">
      <Card />
    </main>
  );
}

async function Card() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-100 p-10 shadow-md">
      <h1 className="text-xl">Create account</h1>
      <SetupForm />
    </div>
  );
}
