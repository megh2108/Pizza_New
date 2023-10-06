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

    let cleanedHash = hash.replace('/', '');
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

    console.log('isAdmin:', isAdmin);


    useEffect(() => {
        const select = (el, all = false) => {
            el = el.trim()
            if (all) {
                return [...document.querySelectorAll(el)]
            } else {
                return document.querySelector(el)
            }
        }

        const on = (type, el, listener, all = false) => {
            if (all) {
                select(el, all).forEach(e => e.addEventListener(type, listener))
            } else {
                select(el, all).addEventListener(type, listener)
            }
        }

        const onscroll = (el, listener) => {
            el.addEventListener('scroll', listener)
        }

        if (select('.toggle-sidebar-btn')) {
            on('click', '.toggle-sidebar-btn', function (e) {
                select('body').classList.toggle('toggle-sidebar')
            })
        }

        if (select('.search-bar-toggle')) {
            on('click', '.search-bar-toggle', function (e) {
                select('.search-bar').classList.toggle('search-bar-show')
            })
        }

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


        const handleClick = (e) => {
            const clickedElement = e.target;
            const navbar = select('#header-nav');

            if (clickedElement.matches('.mobile-nav-toggle')) {
                navbar.classList.toggle('navbar-mobile');
                clickedElement.classList.toggle('bi-list');
                clickedElement.classList.toggle('bi-x');
            }

            if (clickedElement.matches('.navbar a')) {
                navbar.classList.remove('navbar-mobile');
                let navbarToggle = select('.mobile-nav-toggle');
                navbarToggle.classList.toggle('bi-list');
                navbarToggle.classList.toggle('bi-x');
            }

            if (clickedElement.matches('.navbar .dropdown > .abc')) {
                const navbar = select('#navbar');

                if (navbar.classList.contains('navbar-mobile')) {
                    e.preventDefault();
                    clickedElement.nextElementSibling.classList.toggle('dropdown-active');
                }
            }

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
                                <span >Home</span>
                            </NavLink>
                        </li>
                        <li class="nav-item  pe-3">
                            <NavLink class="nav-link" to="/About" >
                                <span >About</span>
                            </NavLink>
                        </li>
                        <li class="nav-item  pe-3">
                            <NavLink class="nav-link" to="/Menu" >
                                <span >Menu</span>
                            </NavLink>
                        </li>
                        <li class="nav-item  pe-3">
                            <NavLink class="nav-link" to="/Contact" >
                                <span >Contact Us</span>
                            </NavLink>
                        </li>
                        {state ? (
                            <>

                                <li class="nav-item  pe-3">
                                    <NavLink class="nav-link" to="/Cart" >
                                        <span >Cart</span>
                                    </NavLink>
                                </li>
                                {isAdmin && (
                                    <li class="nav-item  pe-3">
                                        <NavLink class="nav-link" to="/Dashboard" >
                                            <span >Dashboard</span>
                                        </NavLink>
                                    </li>
                                )}
                                <li class="nav-item  pe-3">
                                    <NavLink class="nav-link" to="/Logout" >
                                        <span >Logout</span>
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>

                                <li class="nav-item  pe-3">
                                    <NavLink class="nav-link" to="/Signup" >
                                        <span >Register</span>
                                    </NavLink>
                                </li>
                                <li class="nav-item  pe-3">
                                    <NavLink class="nav-link" to="/Login" >
                                        <span >Login</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                    </ul>
                    <i className="bi bi-list mobile-nav-toggle"></i>

                </nav>


            </header>
        </>
    )
}

export default Navbar
