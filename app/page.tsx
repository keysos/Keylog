import LoggedInHome from "@/components/home/LoggedInHome";
import PublicHome from "@/components/home/PublicHome";

export default function Home() {
  const isLogged = true;

  return isLogged ? <LoggedInHome /> : <PublicHome />;
}
