import React from 'react'
import "./Cpassword.css";

const Cpassword = () => {
    return (
        <>
            <section className="section  min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container Cpassword">
                    <div className="row justify-content-center">
                        <div className="card mb-3">

                            <div className="card-body">

                                <div className="pt-4 pb-2">
                                    <h5 className="card-title text-center pb-0 fs-4">Change Your Password</h5>
                                </div>

                                <form className="row g-3" >

                                    <div className="col-12">
                                        <label for="yourUsername" className="form-label">Current Password</label>
                                        <input type="email" name="email" className="form-control" id="yourUsername" required

                                        />
                                    </div>
                                    <div className="col-12">
                                        <label for="yourUsername" className="form-label">New Password</label>
                                        <input type="email" name="email" className="form-control" id="yourUsername" required

                                        />
                                    </div>
                                    <div className="col-12">
                                        <label for="yourUsername" className="form-label">Re-enter New Password</label>
                                        <input type="email" name="email" className="form-control" id="yourUsername" required

                                        />
                                    </div>




                                    <div className="col-12 btndiv">
                                        <button className="btn btn-primary change" type="submit" >Change</button>
                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </section >

        </>
    )
}

export default Cpassword
