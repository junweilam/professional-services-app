import React, { useState, useEffect } from 'react';
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken }from "../features/CheckToken";

const FaqPage = () => {

  const [showModal, setShowModal] = useState(false);

  const closeExpiredModal = () => {
    setShowModal(false);
    window.location.href = './signin';
  };

  useEffect(() => {
    CheckToken(setShowModal)
  }, []);

  return (
    <div className="min-h-screen">
      <div className="bg-white p-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>

        {/* General Questions */}
        <div>
          <h3 className="text-xl font-semibold mb-2">General Questions</h3>
          <div className="mb-4">
            <p>
              <strong>Q1: What is Your Home Services Hub?</strong><br />
              <span>A: Your Home Services Hub is an online platform that connects homeowners with a wide range of professional services for their homes. We offer services such as pest control, cleaning, maintenance, repairs, landscaping, home renovations, appliance services, interior design, and home security.</span>
            </p>
          </div>
          {/* Add more questions and answers as needed */}
        </div>

        {/* Services and Pricing */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Services and Pricing</h3>
          <div className="mb-4">
            <p>
              <strong>Q4: How do you determine the pricing for services?</strong><br />
              <span>A: Pricing varies depending on the type of service you require. We offer competitive and transparent pricing. You can find detailed pricing information on our website or request a quote for your specific needs.</span>
            </p>
          </div>
          {/* Add more questions and answers as needed */}
        </div>

        {/* Scheduling and Appointments */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Scheduling and Appointments</h3>
          <div className="mb-4">
            <p>
              <strong>Q6: How can I schedule a service appointment?</strong><br />
              <span>A: You can schedule an appointment by visiting our website, selecting the service you need, and choosing a convenient date and time.</span>
            </p>
          </div>
          {/* Add more questions and answers as needed */}
        </div>

        {/* Service Providers */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Service Providers</h3>
          <div className="mb-4">
            <p>
              <strong>Q8: Who are the service providers on Your Home Services Hub?</strong><br />
              <span>A: Our service providers are experienced professionals who are licensed and certified in their respective fields. We carefully vet and select them to ensure they meet our quality standards.</span>
            </p>
          </div>
          {/* Add more questions and answers as needed */}
        </div>

        {/* Security and Privacy */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Security and Privacy</h3>
          <div className="mb-4">
            <p>
              <strong>Q10: Is my personal information safe with Your Home Services Hub?</strong><br />
              <span>A: Absolutely. We prioritize your privacy and implement robust security measures to protect your personal information. For more details, please refer to our <a href="/privacy-policy">Privacy Policy</a>.</span>
            </p>
          </div>
          {/* Add more questions and answers as needed */}
        </div>

        {/* Contact and Support */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Contact and Support</h3>
          <div className="mb-4">
            <p>
              <strong>Q11: How can I reach Your Home Services Hub for assistance or inquiries?</strong><br />
              <span>A: We're here to help! You can reach us at the following:
                <br />
                Email: <a href="mailto:info@yourhomeserviceshub.com">info@yourhomeserviceshub.com</a>
                <br />
                Phone: <a href="tel:+1234567890">123-456-7890</a>
              </span>
            </p>
          </div>
          
        </div>
      </div>
      <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
    </div>
  );
};

export default FaqPage;
