import AppWrapper from "./_components/appWrapper";
import Button from "./_components/ui/button";
import { logout } from "./lib/actions";

export default async function Home() {
  return (
    <AppWrapper>
      <main>
        <form action={logout} method="post">
          <Button type="submit" varian="secondary">
            Sign out
          </Button>
        </form>
      </main>
    </AppWrapper>
  );
}
