import React, { useState } from 'react';
import "./Cpassword.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cpassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        reenterNewPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.status === 200 || !data) {
                console.log('Password changed successfully!');
                toast.success("Password changed successfully!");


                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    reenterNewPassword: ''
                });

            } else if (response.status === 500 || !data) {
                console.error('Failed to change password');
                toast.error("Failed to change password");

            }
            else if (response.status === 400 || !data) {
                console.error('Internal Error');
                toast.error("Internal Error");

            }

        } catch (error) {
            console.error('Error:', error);


        }



    };

    return (
        <>
            <section className="section min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container Cpassword">
                    <div className="row justify-content-center">
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="pt-4 pb-2">
                                    <h5 className="card-title text-center pb-0 fs-4">Change Your Password</h5>
                                </div>
                                <form className="row g-3">
                                    <div className="col-12">
                                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            className="form-control"
                                            id="currentPassword"
                                            autoComplete="current-password" // Add this line
                                            required
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                        />

                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="newPassword" className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            className="form-control"
                                            id="newPassword"
                                            autoComplete="new-password"
                                            required
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="reenterNewPassword" className="form-label">Re-enter New Password</label>
                                        <input
                                            type="password"
                                            name="reenterNewPassword"
                                            className="form-control"
                                            id="reenterNewPassword"
                                            autoComplete="new-password"
                                            required
                                            value={formData.reenterNewPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-12 btndiv">
                                        <button className="btn btn-primary change" type="submit" onClick={handleSubmit}>Change</button>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Cpassword;
