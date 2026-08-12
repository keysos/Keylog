import LoggedInHome from "./components/LoggedInHome";
import PublicHome from "./components/PublicHome";

export default function Home() {
  const isLogged = true;

  return isLogged ? <LoggedInHome /> : <PublicHome />;
}
