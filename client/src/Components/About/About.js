import React from 'react'
import './About.css'
import { NavLink } from 'react-router-dom'

function About() {
  return (
    <>
      <section id="about" className="about">
        <div className="container" data-aos="fade-up">

          <div className="section-header">
            <h2>About Us</h2>
            <p>Learn More <span>About Us</span></p>
          </div>

          <div className="contents row gy-4">
            <div className="col-lg-6 position-relative about-img" style={{ "background-image": "url(assets/img/cheesypizza.jpg)" }} data-aos="fade-up" data-aos-delay="150">
            </div>

            <div className="col-lg-6 d-flex" data-aos="fade-up" data-aos-delay="300">
              <div className="content ps-0 ps-lg-5">
                <p className="fst-italic">
                  Indulge in the Irresistible World of Cheesy Pizza! <br /><br />
                  At Cheesy Pizza, we're not just another pizza joint; we're creators of edible art that's as rich in flavor as it is in passion. Our story begins with a slice of imagination and a dash of dedication, resulting in a culinary haven where cheese reigns supreme and every bite tells a tale.                </p>
                <ul>
                  <li><i className="bi bi-check2-all"></i> We don't just create pizza; we curate moments. Each pizza is handcrafted with meticulous attention to detail, as if it were a work of art. Our chefs, armed with creativity and culinary prowess, transform the simplest of ingredients into flavor explosions that dance on your palate.</li>
                  <li><i className="bi bi-check2-all"></i>What makes Cheesy Pizza an experience to remember? It's the fusion of tradition and innovation. Our dough, perfected over time, boasts a harmony of crispiness and chewiness that provides the perfect foundation.</li>
                  <li><i className="bi bi-check2-all"></i>When you choose Cheesy Pizza, you're embracing more than a gastronomic delight; you're embracing a philosophy. Our promise to you is unwavering – to keep pushing the boundaries of flavor, to keep celebrating the cheesy goodness that brings joy, and to keep turning ordinary moments into extraordinary memories.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

    </>
  )
}

export default About
