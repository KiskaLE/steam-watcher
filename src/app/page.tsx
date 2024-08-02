import { getServerAuthSession } from "~/server/auth";
import AppWrapper from "./_components/appWrapper";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <AppWrapper>
      <main></main>
    </AppWrapper>
  );
}
