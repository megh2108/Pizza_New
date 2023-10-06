import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [type, setType] = useState('');
    const [shopID, setShopID] = useState('');
    const [secretKey, setSecretkey] = useState('');

    const PostData = async (e) => {
        e.preventDefault();

        const requestBody = {
            name, email, phone, password, cpassword, type
        };

        if (type === "admin") {
            requestBody.shopID = shopID;
            requestBody.secretKey = secretKey;
        }


        const response = await fetch("/sign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),

        });

        const res = await response.json();
        console.log(response.status);

        if (response.status === 422 || !res) {
            toast.error("Invalid registration");
            console.log("Invalid registration");
        } else {
            toast.success("Registration Successfull");
            console.log("Successfull Registration");

            navigate("/Login");

        }

    };

    return (
        <>
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-6 d-flex flex-column align-items-center justify-content-center">

                            <div className="d-flex justify-content-center py-4">
                                <a href="s" className="logo d-flex align-items-center w-auto">
                                    <img src="assets/img/logo.png" alt="" />
                                    <span className="d-none d-lg-block">Cheesy Pizza</span>
                                </a>
                            </div>

                            <div className="card mb-3">

                                <div className="card-body">

                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                                        <p className="text-center small">Enter your personal details to create account</p>
                                    </div>

                                    <form className="row g-3 " method="POST" >
                                        <div className="col-12">
                                            <label for="yourName" className="form-label">Your Name</label>
                                            <input type="text" name="name" className="form-control" id="yourName" required
                                                value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>

                                        <div className="col-6">
                                            <label for="yourEmail" className="form-label">Your Email</label>
                                            <input type="email" name="email" className="form-control" id="yourEmail" required
                                                value={email} onChange={(e) => setEmail(e.target.value)}

                                            />
                                        </div>
                                        <div className="col-6">
                                            <label for="yourEmail" className="form-label">Your Contact</label>
                                            <input type="text" name="number" className="form-control" id="yourContact" required
                                                value={phone} onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>



                                        <div className="col-6">
                                            <label for="yourPassword" className="form-label">Password</label>
                                            <input type="password" name="password" className="form-control" id="yourPassword" required
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label for="yourPassword" className="form-label">Confirm Password</label>
                                            <input type="password" name="cpassword" className="form-control" id="yourPassword" required
                                                value={cpassword} onChange={(e) => setCpassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label for="userType" className="form-label">User Type</label>
                                            <div className="row">

                                                <div class="form-check col-lg-6">
                                                    <input class="form-check-input" type="radio" name="userType" id="user"
                                                        value="user" onChange={(e) => setType(e.target.value)} />
                                                    <label class="form-check-label" for="userType">
                                                        Customer
                                                    </label>

                                                </div>
                                                <div class="form-check col-lg-6">
                                                    <input class="form-check-input" type="radio" name="userType" id="admin"
                                                        value="admin" onChange={(e) => setType(e.target.value)} />
                                                    <label class="form-check-label" for="userType">
                                                        Admin
                                                    </label>

                                                </div>
                                            </div>
                                        </div>
                                        {type === "admin" ? (
                                            <>
                                                <div className="col-6">
                                                    <label for="yourSecretKey" className="form-label">Secret Key</label>
                                                    <input type="text" name="secretkey" className="form-control" id="yourSecretKey" required
                                                        value={secretKey}
                                                        onChange={(e) => setSecretkey(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-6">

                                                    <label for="yourSecretKey" className="form-label">Shop ID</label>
                                                    <input type="text" name="secretkey" className="form-control" id="yourSecretKey" required
                                                        value={shopID}
                                                        onChange={(e) => setShopID(e.target.value)}
                                                    />
                                                </div>
                                            </>
                                        ) : null}



                                        <div className="col-12">
                                            <button className="btn btn-primary w-100" type="submit" onClick={PostData}>Create Account</button>
                                        </div>
                                        <div className="col-12">
                                            <p className="small mb-0">Already have an account? <a href="/Login">Log in</a></p>
                                        </div>
                                    </form>

                                </div>
                            </div>



                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default Signup
