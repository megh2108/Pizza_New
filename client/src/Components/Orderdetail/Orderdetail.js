import React, { useState, useEffect } from 'react';
import { DataTable } from 'simple-datatables';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orderdetails = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);


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

    useEffect(() => {
        fetch("/getorderdetail", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);

              
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    }, []);

   


    useEffect(() => {
        const datatables = document.querySelectorAll('.datatable');

        datatables.forEach((datatable) => {
            new DataTable(datatable);
        });
    }, []);

    return (
        <>
            <section className="section register min-vh-100 d-flex flex-column align-items-center py-4" id="section">
                <div className="container">
                    <div className="card justify-content-center">
                        <div className="card-body">
                            <h5 className="card-title col-lg-12">Order Records</h5>
                            <div className="table-responsive">
                                <table className="table table-bordered datatable">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sr No.</th>
                                            <th scope="col">Order No.</th>
                                            <th scope="col">Items</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice().reverse().map((order,index) => (
                                            <tr key={order._id}>
                                                <td>{index+1}</td>
                                                <td>Order - {orders.length - index }</td>
                                                {/* <td>{order.orderID}</td> */}
                                                <td>
                                                    <button
                                                        className="btn btn-primary w-100"
                                                        type="button"
                                                        data-fancybox
                                                        data-src={`#details-${order.orderID}`}
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                                <div id="detials" style={{ "display": "none" }}>
                                    <h1>Order Detail</h1>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">Item Name</th>
                                                <th scope="col">Size</th>
                                                <th scope="col">Quantity</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <div id={`details-${order.orderID}`} key={order._id} style={{ "display": "none" }}>
                                                    <h3 style={{"text-align":"center","margin-bottom":"25px"}}>Order Detail</h3>
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Item Name</th>
                                                                <th scope="col">Size</th>
                                                                <th scope="col">Quantity</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.items.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{item.itemName}</td>
                                                                    <td>{item.size}</td>
                                                                    <td>{item.quantity}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ))}


                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Orderdetails;

