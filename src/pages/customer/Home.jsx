import React from "react";
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import BestDishes from '../../components/BestDishes';
import ReservationForm from '../../components/ReservationForm';
import Footer from '../../components/Footer';
import OurBranches from "../../components/OurBranches";
import AdvancedSearch from "../../components/AdvancedSearch";

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
      <HeroSection />
      <OurBranches />
      <AdvancedSearch/>
      {/* <ReservationForm /> */}
      <Footer />
    </>
  );
};

export default Home;
