import React from 'react'
import HeroSection from '../component/landing/HeroSection';
import Feature from '../component/landing/FeatureSection';
import PricingSection from '../component/landing/PricingSection';
import TestimonialSection from '../component/landing/TestimonialSection';
import CTASection from '../component/landing/CTASection';
import Footer from '../component/landing/FooterSection';
import FeatureSection from '../component/landing/FeatureSection';
import { features, pricingPlans, testimonials } from '../assets/data';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

const Landing = () => {
  const { openSignIn, openSignUp } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }


  }, [isSignedIn, navigate])

  return (
    <div className="landing-page bg-linear-to-b from-gray-50 to-gray-100">
      <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />

      <FeatureSection features={features} />
      <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp} />

      <TestimonialSection testimonials={testimonials} openSignUp={openSignUp} />
      <CTASection />
      <Footer />


    </div>
  )
}

export default Landing;
