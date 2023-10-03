import React from 'react'
import './Contact.css'

function Contact() {
    return (
        <>
            <section id="contact" className="contact">
                <div className="container" data-aos="fade-up">

                    <div className="section-header">
                        <h2>Contact</h2>
                        <p>Need Help? <span>Contact Us</span></p>
                    </div>

                    <div className="mb-3">
                        <iframe style={{ "border": "0", "width": "100%", "height": "350px" }} src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14738.989800343797!2d72.9544!3d22.5511314!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4dbae57c57ff%3A0x2711db4fe9c17678!2sCHEESY%20PIZZA!5e0!3m2!1sen!2sin!4v1692296304629!5m2!1sen!2sin" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>

                    <div className="row gy-4">

                        <div className="col-md-6">
                            <div className="info-item  d-flex align-items-center">
                                <i className="icon bi bi-map flex-shrink-0"></i>
                                <div>
                                    <h3>Our Address</h3>
                                    <p>Maniya ni Khad,
                                        behind Gopi Cinema Road,
                                        near Balmandir,<br /> Vivekanand Wadi,
                                        Anand, Gujarat 388001</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="info-item d-flex align-items-center">
                                <i className="icon bi bi-envelope flex-shrink-0"></i>
                                <div>
                                    <h3>Email Us</h3>
                                    <p>info@chessypizza.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="info-item  d-flex align-items-center">
                                <i className="icon bi bi-telephone flex-shrink-0"></i>
                                <div>
                                    <h3>Call Us</h3>
                                    <p> +91 77780 43066</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="info-item  d-flex align-items-center">
                                <i className="icon bi bi-share flex-shrink-0"></i>
                                <div>
                                    <h3>Opening Hours</h3>
                                    <div><strong>Mon-Sat:</strong> 11:00 AM - 11:00 PM <br />
                                        <strong>Sunday:</strong> Closed
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <form method="post" role="form" className="php-email-form p-3 p-md-4">
                        <div className="row">
                            <div className="col-xl-6 form-group">
                                <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
                            </div>
                            <div className="col-xl-6 form-group">
                                <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required />
                        </div>
                        <div className="form-group">
                            <textarea className="form-control" name="message" rows="5" placeholder="Message" required></textarea>
                        </div>
                        <div className="my-3">
                            <div className="loading">Loading</div>
                            <div className="error-message"></div>
                            <div className="sent-message">Your message has been sent. Thank you!</div>
                        </div>
                        <div className="text-center"><button type="submit">Send Message</button></div>
                    </form>

                </div>
            </section>
        </>
    )
}

export default Contact
