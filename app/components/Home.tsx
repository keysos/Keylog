import AboutKeylog from "./AboutKeylog";
import HeroSection from "./HeroSection";
import PopularReviews from "./PopularReviews";
import TrendingGames from "./TrendingGames";
import UserOverview from "./UserOverview";

type HomeProps = {
  isLoggedIn: boolean;
};

const Home = ({ isLoggedIn }: HomeProps) => {
  return (
    <div className="mt-16 mb-8 flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-0 lg:mx-auto lg:mt-32">
      {!isLoggedIn && <HeroSection />}
      {isLoggedIn && <UserOverview />}
      <TrendingGames />
      {!isLoggedIn && <AboutKeylog />}
      <PopularReviews />
    </div>
  );
};

export default Home;
