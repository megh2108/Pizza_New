import React, { useEffect, useState } from 'react';
import './Menu.css';
import { useNavigate } from 'react-router-dom';
import PizzaCard from './Pizzacard';

const Menus = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);


    const callMenuPage = async () => {
        try {
            const response = await fetch("/getpizza", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const res = await response.json();
            console.log(res);

            setUserData(res);
            setLoading(false);


            if (!response.ok) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            //   navigate("/login");
        }
    }

    useEffect(() => {
        callMenuPage();
    }, []);

    return (
        <>
            <section className="section" id="menu">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Menu</h2>
                        <p>Check Our <span>Cheesy Pizza Menu</span></p>
                    </div>
                    <ul className="nav nav-tabs d-flex justify-content-center" data-aos="fade-up" data-aos-delay="200">

                        <li className="nav-item">
                            <a className="nav-link active show" data-bs-toggle="tab" data-bs-target="#menu-pizzas">
                                <h4>Pizzas</h4>
                            </a>
                        </li>


                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-sendwiches">
                                <h4>Sandwiches</h4>
                            </a>
                        </li>


                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-burgers">
                                <h4>Burgers</h4>
                            </a>
                        </li>



                    </ul>
                    {loading ? (
                        <h4 style={{ "text-align": "center","margin-top":"50px" }}>  Loading...</h4>
                    ) : (

                        <div className="tab-content" data-aos="fade-up" data-aos-delay="300">

                            <div className="tab-pane fade active show" id="menu-pizzas">


                                <div className="row">
                                    {userData.map((menuItem) => (
                                        <PizzaCard key={menuItem.id} pizza={menuItem} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default Menus;
