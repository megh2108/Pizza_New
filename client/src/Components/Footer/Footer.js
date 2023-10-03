import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <>
      <div id="footer" className="footer">

        <div className="container">
          <div className="row gy-3">
            <div className="col-lg-3 col-md-6 d-flex">
              <i className="bi bi-geo-alt icon"></i>
              <div>
                <h4>Address</h4>
                <p>
                  Maniya ni Khad, <br />behind Gopi Cinema Road, <br />
                  near Balmandir, Vivekanand Wadi,<br />
                  Anand, Gujarat 388001
                </p>
              </div>

            </div>

            <div className="col-lg-3 col-md-6 footer-links d-flex">
              <i className="bi bi-telephone icon"></i>
              <div>
                <h4>Reservations</h4>
                <p>
                  <strong>Phone:</strong> +91 77780 43066<br />
                  <strong>Email:</strong> info@chessypizza.com<br />
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 footer-links d-flex">
              <i className="bi bi-clock icon"></i>
              <div>
                <h4>Opening Hours</h4>
                <p>
                  <strong>Mon-Sat : </strong><br /> 11:00 AM - 11:00 PM<br />
                  <strong>Sunday : </strong>  Closed
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Follow Us</h4>
              <div className="social-links d-flex">
                <NavLink to="#" className="twitter"><i className="bi bi-twitter"></i></NavLink>
                <NavLink to="#" className="facebook"><i className="bi bi-facebook"></i></NavLink>
                <NavLink to="#" className="instagram"><i className="bi bi-instagram"></i></NavLink>
                <NavLink to="#" className="linkedin"><i className="bi bi-linkedin"></i></NavLink>
              </div>
            </div>

          </div>
        </div>

        <div className="container">
          <div className="copyright">
            &copy; Copyright <strong><span>Chessy Pizza</span></strong>. All Rights Reserved <br />
          </div>
          <div className="credits">
            Designed by <NavLink to="/">Pooja Sorathiya - 21CP324 </NavLink>| <NavLink to="/">Megh Shah - 20CP041</NavLink>  | <NavLink to="/">Rahul Katara - 21CP316</NavLink>
          </div>
        </div>

      </div>


    </>
  )
}
export default Footer;