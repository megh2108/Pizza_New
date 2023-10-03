import React, { useEffect, useState, useContext } from 'react'
import './Navbar.css'
import { NavLink } from 'react-router-dom';

import { UserContext } from '../../App';


const select = (el, all = false) => {
    el = el.trim();

    if (el.startsWith('/')) {
        el = el.substring(1);
    }

    if (all) {
        return [...document.querySelectorAll(el)];
    } else {
        return document.querySelector(el);
    }
};



const scrollto = (hash) => {
    let header = select('#header');
    let offset = header.offsetHeight;

    let cleanedHash = hash.replace('/', ''); // Remove the leading forward slash
    let element = select(cleanedHash);

    if (element) {
        let elementPos = element.offsetTop;
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth',
        });
    }
};

const Navbar = () => {

    const { state, dispatch } = useContext(UserContext);
    const isAdmin = state && state.isAdmin;

    // Add console.log here to check the value of isAdmin
    console.log('isAdmin:', isAdmin);


    useEffect(() => {
        // Easy selector helper function
        const select = (el, all = false) => {
            el = el.trim()
            if (all) {
                return [...document.querySelectorAll(el)]
            } else {
                return document.querySelector(el)
            }
        }

        // Easy event listener function
        const on = (type, el, listener, all = false) => {
            if (all) {
                select(el, all).forEach(e => e.addEventListener(type, listener))
            } else {
                select(el, all).addEventListener(type, listener)
            }
        }

        // Easy on scroll event listener 
        const onscroll = (el, listener) => {
            el.addEventListener('scroll', listener)
        }

        // Sidebar toggle
        if (select('.toggle-sidebar-btn')) {
            on('click', '.toggle-sidebar-btn', function (e) {
                select('body').classList.toggle('toggle-sidebar')
            })
        }

        // Search bar toggle
        if (select('.search-bar-toggle')) {
            on('click', '.search-bar-toggle', function (e) {
                select('.search-bar').classList.toggle('search-bar-show')
            })
        }

        // Navbar links active state on scroll
        let navbarlinks = select('#navbar .scrollto', true)
        const navbarlinksActive = () => {
            let position = window.scrollY + 200
            navbarlinks.forEach(navbarlink => {
                if (!navbarlink.hash) return
                let section = select(navbarlink.hash)
                if (!section) return
                if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                    navbarlink.classList.add('active')
                } else {
                    navbarlink.classList.remove('active')
                }
            })
        }
        window.addEventListener('load', navbarlinksActive)
        onscroll(document, navbarlinksActive)

        // Toggle .header-scrolled class to #header when page is scrolled
        let selectHeader = select('#header')
        if (selectHeader) {
            const headerScrolled = () => {
                if (window.scrollY > 100) {
                    selectHeader.classList.add('header-scrolled')
                } else {
                    selectHeader.classList.remove('header-scrolled')
                }
            }
            window.addEventListener('load', headerScrolled)
            onscroll(document, headerScrolled)
        }

    }, []);

    useEffect(() => {


        // moble navbar active
        const handleClick = (e) => {
            const clickedElement = e.target;
            const navbar = select('#header-nav');

            if (clickedElement.matches('.mobile-nav-toggle')) {
                navbar.classList.toggle('navbar-mobile');
                clickedElement.classList.toggle('bi-list');
                clickedElement.classList.toggle('bi-x');
            }

            if (clickedElement.matches('.header-nav .nav-link')) {
                navbar.classList.remove('navbar-mobile');
                let navbarToggle = select('.mobile-nav-toggle');
                navbarToggle.classList.toggle('bi-list');
                navbarToggle.classList.toggle('bi-x');
            }

            // if (clickedElement.matches('.header-nav .dropdown > .abc')) {
            //     const navbar = select('#navbar');

            //     if (navbar.classList.contains('navbar-mobile')) {
            //         e.preventDefault();
            //         clickedElement.nextElementSibling.classList.toggle('dropdown-active');
            //     }
            // }

            if (clickedElement.matches('.scrollto')) {
                const targetHash = clickedElement.getAttribute('to');

                if (targetHash && select(targetHash)) {
                    e.preventDefault();

                    let navbar = select('#navbar');

                    if (navbar.classList.contains('navbar-mobile')) {
                        navbar.classList.remove('navbar-mobile');
                        let navbarToggle = select('.mobile-nav-toggle');
                        navbarToggle.classList.toggle('bi-list');
                        navbarToggle.classList.toggle('bi-x');
                    }

                    scrollto(targetHash);
                }
            }
        };

        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };



    }, []);



    return (
        <>
            <header id="header" className="header fixed-top d-flex align-items-center">

                <div className="d-flex align-items-center justify-content-between">
                    <NavLink to="/" className="logo d-flex align-items-center">
                        <img src="assets/img/logo.png" alt="" />
                        <span className="d-none d-lg-block">Cheesy Pizza</span>
                    </NavLink>
                    {/* <i className="bi bi-list toggle-sidebar-btn"></i> */}
                    {/* <i className="bi bi-list toggle-sidebar-btn" aria-label="Toggle Sidebar" role="button" tabIndex="0"></i> */}
                </div>

                <div className="search-bar">
                    <form className="search-form d-flex align-items-center" method="POST" action="#">
                        <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
                        <button type="submit" title="Search"><i className="bi bi-search"></i></button>
                    </form>
                </div>

                <nav className="header-nav ms-auto" id="header-nav">
                    <ul >

                        <li class="nav-item  pe-3">
                            <NavLink class="nav-link" to="/" >
                                <span class="d-none d-md-block ps-2">Home</span>
                            </NavLink>
                        </li>
                        <li class="nav-item  pe-3">
                            <NavLink class="nav-link" to="/About" >
                                <span class="d-none d-md-block ps-2">About</span>
                            </NavLink>
                        </li>
                        <li class="nav-item  pe-3">
                            <NavLink class="nav-link" to="/Menu" >
                                <span class="d-none d-md-block ps-2">Menu</span>
                            </NavLink>
                        </li>
                        <li class="nav-item  pe-3">
                            <NavLink class="nav-link" to="/Contact" >
                                <span class="d-none d-md-block ps-2">Contact Us</span>
                            </NavLink>
                        </li>
                        {state ? (
                            <>

                                <li class="nav-item  pe-3">
                                    <NavLink class="nav-link" to="/Cart" >
                                        <span class="d-none d-md-block ps-2">Cart</span>
                                    </NavLink>
                                </li>
                                <li class="nav-item  pe-3">
                                    <NavLink class="nav-link" to="/Dashboard" >
                                        <span class="d-none d-md-block ps-2">Dashboard</span>
                                    </NavLink>
                                </li>
                                <li class="nav-item  pe-3">
                                    <NavLink class="nav-link" to="/Logout" >
                                        <span class="d-none d-md-block ps-2">Logout</span>
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>

                                <li class="nav-item  pe-3">
                                    <NavLink class="nav-link" to="/Signup" >
                                        <span class="d-none d-md-block ps-2">Register</span>
                                    </NavLink>
                                </li>
                                <li class="nav-item  pe-3">
                                    <NavLink class="nav-link" to="/Login" >
                                        <span class="d-none d-md-block ps-2">Login</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                    </ul>
                </nav>
                <i className="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
                <i className="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>

            </header>
        </>
    )
}

export default Navbar
