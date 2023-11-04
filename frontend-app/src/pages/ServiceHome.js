import React, { useState, useEffect } from "react";
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken }from "../features/CheckToken";

const ServiceHome = () => {

  const [showModal, setShowModal] = useState(false);

  const closeExpiredModal = () => {
    setShowModal(false);
    window.location.href = './signin';
  };

  useEffect(() => {
    CheckToken(setShowModal)
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Website</h1>
        <p className="text-lg mb-10">
          Welcome to Your Home Services Hub, your one-stop destination for all
          your home service needs. We understand that maintaining a comfortable,
          safe, and clean home is a top priority for you and your family. Our
          platform is designed to simplify your life by offering a comprehensive
          range of professional services that cater to every aspect of your home.
        </p>
        <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-2">Professionalism</h3>
          <p className="text-lg">
            Our network of service providers consists of licensed and certified
            experts in their respective fields. You can trust us with your home's
            needs.
          </p>
        </div>
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-2">Convenience</h3>
          <p className="text-lg">
            With just a few clicks, you can schedule and manage all your home
            service appointments online, making the entire process hassle-free.
          </p>
        </div>
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-2">Affordability</h3>
          <p className="text-lg">
            We offer competitive pricing without compromising on quality. You'll
            find service packages to fit your budget.
          </p>
        </div>
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-2">Reliability</h3>
          <p className="text-lg">
            Your Home Services Hub is dedicated to delivering timely and reliable
            services, ensuring your complete satisfaction.
          </p>
        </div>
        <h2 className="text-3xl font-bold mb-10">
          Make Your Home a Haven with Your Home Services Hub. Explore our services
          and transform your living space today!
        </h2>
      </div>
      <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
    </div>
  );
};

export default ServiceHome;
