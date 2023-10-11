import React, { useState, useEffect } from 'react';
import ServiceCard from '../component/ServiceCard'; 

const Home = () => {
  const [services, setServices] = useState([]);

  // In a real application, you would fetch services from your API.
  // For this example, we'll simulate some static services.
  useEffect(() => {
    const staticServices = [
      {
        id: 1,
        title: 'Web Development',
        description: 'Professional web development services',
      },
      {
        id: 2,
        title: 'Graphic Design',
        description: 'Custom graphic design solutions',
      },
      {
        id: 3,
        title: 'Digital Marketing',
        description: 'Boost your online presence with our marketing expertise',
      },
    ];

    setServices(staticServices);
  }, []);

  const addToCart = (service) => {
    // Implement your addToCart logic here
    // You can use state to manage the cart in this component or pass the addToCart function to the ServiceCard component.
    // For demonstration, I'll just log the added service.
    console.log('Added to cart:', service);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white p-8">
        <h2 className="text-2xl font-semibold mb-4">Services</h2>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} addToCart={addToCart} />
        ))}
      </div>
      <a href="/signup">signup </a>
    </div>
  );
};

export default Home;


