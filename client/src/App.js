import React, { createContext, useReducer } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom'
import { initialState, reducer } from './Components/Reducer/Reducer';

import './App.css';



import Addpizza from './Components/Addpizza/Addpizza';
import Addtopping from './Components/Addtopping/Addtopping';
import Cart from './Components/Cart/Cart';
import Login from './Components/Login/Login';
import Menus from './Components/Menu/Menus';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import Signup from './Components/Signup/Signup';
import Logout from './Components/Logout/Logout';
import Footer from './Components/Footer/Footer';
import Contact from './Components/Contact/Contact';
import About from './Components/About/About';
import Home from './Components/Home/Home'


import ScrollToTop from './Components/Scroll/ScrollToTop'
import Orderrecord from './Components/Orderrecord/Orderrecord';
import Orderdetail from './Components/Orderdetail/Orderdetail';
import Homenew from './Components/Home/Homenew';
import Dashboard from './Components/Dashboard/Dashboard';
import Yourorder from './Components/Yourorder/Yourorder';
import Userdetail from './Components/Userdetail/Userdetail';
import Cpassword from './Components/ChangePassword/Cpassword';
import Addoffer from './Components/Addoffer/Addoffer';

export const UserContext = createContext();


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);


  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>

        <ScrollToTop />
        <Navbar />

        <Routes>
          <Route path="/Addpizza" element={[<Sidebar />, <Addpizza />]} />
          <Route path="/Addtopping" element={[<Sidebar />, <Addtopping />]} />
          <Route path="/Addoffer" element={[<Sidebar />,<Addoffer />]} />
          <Route path="/Orderrecord" element={[<Sidebar />, <Orderrecord />]} />
          <Route path="/Orderdetail" element={[<Sidebar />, <Orderdetail />]} />
          <Route path="/Userdetail" element={[<Sidebar />, <Userdetail />]} />
          <Route path="/Dashboard" element={[<Sidebar />,<Dashboard />]} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Menu" element={<Menus />} />
          <Route path="/Yourorder" element={<Yourorder />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Cpassword" element={<Cpassword />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/About" element={<About />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<Homenew />} /> */}


        </Routes>

        <Footer />


        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} /> {/* Add ToastContainer */}

      </UserContext.Provider>



    </>
  );
}

export default App;
