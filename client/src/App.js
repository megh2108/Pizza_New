import React, { createContext, useReducer } from 'react';


import './App.css';

import { Routes, Route } from 'react-router-dom'


import Addpizza from './Components/Addpizza/Addpizza';
import Addtopping from './Components/Addtopping/Addtopping';
import Cart from './Components/Cart/Cart';
import Login from './Components/Login/Login';
import Menu from './Components/Menu/Menu';
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
import { initialState, reducer } from './Components/Reducer/Reducer';
import Orderrecord from './Components/Orderrecord/Orderrecord';
import Orderdetail from './Components/Orderdetail/Orderdetail';

export const UserContext = createContext();


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);


  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>

        <ScrollToTop />
        <Navbar />

        {/* <Sidebar /> */}
        <Routes>
          <Route path="/Addpizza" element={[<Sidebar />, <Addpizza />]} />
          <Route path="/Addtopping" element={[<Sidebar />, <Addtopping />]} />
          <Route path="/Orderrecord" element={[<Sidebar />, <Orderrecord />]} />
          <Route path="/Orderdetail" element={[<Sidebar />, <Orderdetail />]} />
          <Route path="/Dashboard" element={<Sidebar />} />

          <Route path="/Cart" element={<Cart />} />
          {/* <Route path="/Menu" element={<Menu />} /> */}
          <Route path="/Menu" element={<Menus />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/About" element={<About />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Home />} />

          {/* <Route path="/Contact" element={<Contact />} /> */}
          {/* <Route path="/About" element={<About />} /> */}
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>

        <Footer />

        {/* </Space> */}
        {/* <Menu /> */}
        {/* <Cart /> */}
        {/* <Signup /> */}
        {/* <Login /> */}

      </UserContext.Provider>



    </>
  );
}

export default App;
