import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
    const { state, dispatch } = useContext(UserContext);

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const loginUser = async (e) => {
      e.preventDefault();
  
      const res = await fetch('/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
  
      const data = await res.json();
  
      if (res.status === 400 || !data) {
        toast.error("Invalid Login"); 
      } else if (res.status === 200) {
        dispatch({ type: "ADMIN", payload: true });
        toast.success("Admin Successfully Logged In"); 
        navigate("/Dashboard");
      } else {
        dispatch({ type: "USER", payload: true });
        toast.success("User Successfully Logged In"); 
        navigate("/Home");
      }
  
    }
    return (
        <>
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                            <div className="d-flex justify-content-center py-4">
                                <a href="index.html" className="logo d-flex align-items-center w-auto">
                                    {/* <img src="assets/img/logo.png" alt="" /> */}
                                    <span className="d-none d-lg-block">Cheesy Pizza</span>
                                </a>
                            </div>

                            <div className="card mb-3">

                                <div className="card-body">

                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                        <p className="text-center small">Enter your email-id & password to login</p>
                                    </div>

                                    <form className="row g-3" >

                                        <div className="col-12">
                                            <label for="yourUsername" className="form-label">Email-Id</label>
                                            <input type="email" name="email" className="form-control" id="yourUsername" required 
                                                 value={email} onChange={(e) => setEmail(e.target.value)} 
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label for="yourPassword" className="form-label">Password</label>
                                            <input type="password" name="password" className="form-control" id="yourPassword" required 
                                                 value={password} onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>


                                        <div className="col-12">
                                            <button className="btn btn-primary w-100" type="submit" onClick={loginUser}>Login</button>
                                        </div>
                                        <div className="col-12">
                                            <p className="small mb-0">Don't have account? <a href="/Signup">Create an account</a></p>
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

export default Login
