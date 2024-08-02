import React from "react";
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import BestDishes from '../../components/BestDishes';
import ReservationForm from '../../components/ReservationForm';
import Footer from '../../components/Footer';
import OurBranches from "../../components/OurBranches";

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
      <HeroSection />
      <OurBranches />
      {/* <ReservationForm /> */}
      <Footer />
    </>
  );
};

export default Home;
