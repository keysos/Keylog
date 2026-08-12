import React from "react";
import UserOverview from "./UserOverview";
import TrendingGames from "./TrendingGames";
import PopularReviews from "./PopularReviews";

const LoggedInHome = () => {
  return (
    <div className="mt-16 mb-8 flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-0 lg:mx-auto lg:mt-32">
      <UserOverview />
      <TrendingGames />
      <PopularReviews />
    </div>
  );
};

export default LoggedInHome;
