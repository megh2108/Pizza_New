import React, { useEffect, useState } from 'react'
import {  useNavigate } from "react-router-dom";
import './Dashboard.css'


const Dashboard = () => {
    const navigate = useNavigate();

    const [salesData, setSalesData] = useState({ daily: 0, weekly: 0, monthly: 0, total: 0 });

    useEffect(() => {
        fetch('/dashboard/sales', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((res) => { return res.json();
            })
            .then((data) => {
                setSalesData(data.response);
                console.log(salesData);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

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
                navigate('/');

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
                        <div className="section-header">
                            <h2>Dashboard</h2>
                            <p>Total <span>Orders</span></p>
                        </div>

                        <div class="card col-lg-3 dcard">
                            <div class="card-body">
                                <h3 class="card-title">Daily</h3>
                                <h4 class="card-text">{salesData.daily}</h4>
                                {/* <h4 class="card-text">10</h4> */}
                            </div>
                        </div>
                        <div class="card col-lg-3 dcard">
                            <div class="card-body">
                                <h3 class="card-title">Weekly</h3>
                                <h4 class="card-text">{salesData.weekly}</h4>
                            </div>
                        </div>
                        <div class="card col-lg-3 dcard">
                            <div class="card-body">
                                <h3 class="card-title">Monthly</h3>
                                <h4 class="card-text">{salesData.monthly}</h4>
                            </div>
                        </div>
                        <div class="card col-lg-3 dcard">
                            <div class="card-body">
                                <h3 class="card-title">Total</h3>
                                <h4 class="card-text">{salesData.total}</h4>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default Dashboard
