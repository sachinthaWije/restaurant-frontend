import React from "react";
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import BestDishes from '../../components/BestDishes';
import ReservationForm from '../../components/ReservationForm';
import Footer from '../../components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <BestDishes />
      <ReservationForm />
      <Footer />
    </>
  );
};

export default Home;
