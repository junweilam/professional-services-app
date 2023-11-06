import React, { useState, useEffect } from 'react';
import ServiceCard from '../component/ServiceCard';
import { useNavigate } from 'react-router-dom';
import { getServices, getAuthorization } from '../features/apiCalls';
import { useCart } from '../context/CartContext'
import UnauthorizedUserPage from '../component/UnauthorizedUserPage';
import { TokenExpireModal } from "../component/TokenExpireModal";
import { CheckToken }from "../features/CheckToken";


const Home = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  //const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { cart, addToCart, removeFromCart } = useCart();

  // const addToCart = (service) => {
  //   const itemIndex = cart.findIndex((item) => item.id === service.id);
  //   if (itemIndex !== -1) {
  //     const updatedCart = [...cart];
  //     updatedCart[itemIndex].quantity++;
  //     setCart(updatedCart);
  //   } else {
  //     setCart([...cart, { ...service, quantity: 1 }]);
  //   }
  // };

  

  const closeExpiredModal = () => {
      setShowModal(false);
      window.location.href = './signin';
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // const removeFromCart = (item) => {
  //   const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
  //   setCart(updatedCart);
  // };

  const handleOrderHistory  = () =>{
    window.location.href = './orderhistory';
  }

  const handleCheckout = () => {
    navigate('/cart', { state: { cart } });
  };

  const isCartEmpty = cart.length === 0;

  useEffect(() => {
    // Simulate fetching services from an API or other data source.
    async function fetchData(){
      try{
        const response = await getServices();
        setServices(response.data);
        
      }catch(err){
        console.error('API call error: ', err);
      }
    }
    async function fetchUserAuthorization(){
      try{
        let token = {token: localStorage.getItem("token")}
        if(token != null){
          const response = await getAuthorization(token);
          if(response.results == 3){
            setIsAuthorized(true);
          }else{
            setIsAuthorized(false);
          }
        }
       

      }catch(err){
        console.error('API call error: ', err);
      }
    }
    fetchData();
    CheckToken(setShowModal)
    fetchUserAuthorization();
    
  }, []);

  return (
    isAuthorized ? (
      <div className="min-h-screen">
        <div className="bg-white p-8">
          <div className="flex justify-between items-center">
          <button onClick={handleOrderHistory} className ="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2">Order History</button>
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            <div className="relative inline-block">
              <button onClick={toggleCart} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6a1 1 0 011 1h4a1 1 0 011 1M3 8h18M2 4l2-2h16l2 2"/>
                </svg>
                <span className="ml-1">{cart.length}</span>
              </button>
              {isCartOpen && (
                <div className="cart-dropdown absolute right-0 mt-2 bg-white border border-gray-200 p-2 rounded-md shadow-md">
                  <h2 className="text-xl font-semibold mb-2">Shopping Cart</h2>
                  {isCartEmpty ? (
                    <p>Cart is empty</p>
                  ) : (
                    <ul>
                      {cart.map((item) => (
                        <li key={item.id} className="flex justify-between items-center border-b pb-2">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <img src={item.image} alt={item.title} className="h-12 w-12 object-cover mr-2" />
                              <div>
                                {item.title}
                              </div>
                              <div className="flex items-center ml-10">
                                <span>Qty: {item.quantity}</span>
                                <span className="ml-4">Price: ${item.price * item.quantity}</span>
                              </div>
                            </div>
                            <div className="flex items-center mr-5">
                              <button onClick={() => removeFromCart(item)} className="text-red-500 hover:text-red-600 ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isCartEmpty && (
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2" onClick={handleCheckout}>Checkout</button>
                  )}
                </div>
              )}
            </div>
          </div>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              addToCart={addToCart}
            />
          ))}
        </div>
        <TokenExpireModal show={showModal} onClose={closeExpiredModal} />
      </div>
    ) : (
      <UnauthorizedUserPage isAuthorized={isAuthorized} />
    )
  );
};

export default Home;
