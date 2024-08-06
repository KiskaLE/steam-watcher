"use server";

import login from "~/app/login/action";
import { Input } from "../form";
import Button from "../ui/button";
import { revalidatePath } from "next/cache";

let error: string | null = null;

export default async function LoginForm() {
  async function handleAction(formData: FormData) {
    "use server";
    try {
      const res = await login(formData);
      if (res.error) {
        error = res.error;
      }
    } catch (error) {
      console.error(error);
    }

    revalidatePath("/");
  }

  return (
    <form
      className="flex w-[300px] flex-col gap-2"
      action={handleAction}
      method="POST"
    >
      <Input id="email" name="email" type="email" label="Email" />
      <Input id="password" name="password" type="password" label="Password" />
      {error && (
        <em typeof="error" style={{ color: "red" }}>
          {error}
        </em>
      )}
      <Button type="submit" varian="primary">
        Login
      </Button>
    </form>
  );
}
