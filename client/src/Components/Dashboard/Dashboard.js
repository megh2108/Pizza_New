import React ,{useEffect} from 'react'
import { Navigate, useNavigate } from "react-router-dom";


const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        fetch('/admin', {
            method: "GET",
            headers: {
                Accept: "appllication/json",
                "Content-Type": "application/json"
            },
            credentials: "include"

        }).then((res) => {
            // dispatch({ type: "USER", payload: false })
            if (res.status === 404) {
                navigate('/Menu');
                
            }
        }).catch((err) => {
            console.log(err);
        });
    });

    return (
        <>
            <section className="section register min-vh-100 d-flex flex-column align-items-center  py-4" id="section">
                <div className="container">
                    <div className="row ">

                    </div>
                </div>
            </section>
        </>
    )
}

export default Dashboard
