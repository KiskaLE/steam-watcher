import { api } from "~/trpc/server";
import LoginForm from "../_components/forms/loginForm";
import { redirect } from "next/navigation";
import Card from "../_components/ui/card";

export default async function Login() {
  if (await api.user.noUsers()) {
    redirect("/setup");
  }
  return (
    <main className="flex min-h-screen flex-col items-center pt-14">
      <Card>
        <h1 className="text-xl">Sign in</h1>
        <LoginForm />
      </Card>
    </main>
  );
}
