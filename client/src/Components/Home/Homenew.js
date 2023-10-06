import React from 'react'
import './Homenew.css'
import { NavLink } from 'react-router-dom'

const Homenew = () => {
    return (
        <>
            <div id="carouselExampleFade" class="carousel slide carousel-fade" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        {/* <img src="assets/img/slides-1.jpg" class="d-block w-100" alt="..." /> */}
                        <section id="hero" className="hero d-flex align-items-center section-bg">
                            <div className="container">
                                <div className="row justify-content-between gy-5">
                                    <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center align-items-center align-items-lg-start text-center text-lg-start">
                                        <h2 data-aos="fade-up">Enjoy Your Healthy<br />Delicious Food</h2>
                                        <p data-aos="fade-up" data-aos-delay="100">Hello Customers!!!</p>
                                        <div className="d-flex">
                                            <NavLink to="/Menu" className="btn-book-a-table">Menu</NavLink>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 order-1 order-lg-2 text-center text-lg-start">
                                        <img src="assets/img/hero-img.png" className="img-fluid" alt="" data-aos="zoom-out" data-aos-delay="300" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div class="carousel-item">
                        {/* <img src="assets/img/slides-2.jpg" class="d-block w-100" alt="..." /> */}
                        <section id="hero" className="hero d-flex align-items-center section-bg">
                            <div className="container">
                                <div className="row justify-content-between gy-5">
                                    <div className="col-lg-5 order-1 order-lg-2 text-center text-lg-start">
                                        <img src="assets/img/hero-img.png" className="img-fluid" alt="" data-aos="zoom-out" data-aos-delay="300" />
                                    </div>
                                    <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center align-items-center align-items-lg-start text-center text-lg-start">
                                        <h2 data-aos="fade-up">Enjoy Your Healthy<br />Delicious Food</h2>
                                        <p data-aos="fade-up" data-aos-delay="100">Hello Customers!!!</p>
                                        <div className="d-flex">
                                            <NavLink to="/Menu" className="btn-book-a-table">Namaste</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div class="carousel-item">
                        {/* <img src="assets/img/slides-3.jpg" class="d-block w-100" alt="..." /> */}
                        <section id="hero" className="hero d-flex align-items-center section-bg">
                            <div className="container">
                                <div className="row justify-content-between gy-5">
                                    <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center align-items-center align-items-lg-start text-center text-lg-start">
                                        <h2 data-aos="fade-up">Enjoy Your Healthy<br />Delicious Food</h2>
                                        <p data-aos="fade-up" data-aos-delay="100">Hello Customers!!!</p>
                                        <div className="d-flex">
                                            <NavLink to="/Menu" className="btn-book-a-table">Hello</NavLink>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 order-1 order-lg-2 text-center text-lg-start">
                                        <img src="assets/img/hero-img.png" className="img-fluid" alt="" data-aos="zoom-out" data-aos-delay="300" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>

            </div>
        </>
    )
}

export default Homenew
