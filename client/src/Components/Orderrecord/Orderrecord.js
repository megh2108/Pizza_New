import React, { useState, useEffect } from 'react';
import { DataTable } from 'simple-datatables';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Orderrecord = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [orderDates, setOrderDates] = useState([]);
    const [users, setUsers] = useState({});
    const [shops, setShops] = useState({})

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
        fetch("/getorder", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // data.Order_Record.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(data.Order_Record);
                setOrderDates(data.orderDates);
                // Iterate through orders and fetch user and shop information
                data.Order_Record.forEach((order) => {
                    fetchUser(order.userID);
                    fetchShop(order.shopID);
                });
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    }, []);

    // Function to fetch user information
    const fetchUser = (userID) => {
        fetch(`/getUser/${userID}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUsers((prevUsers) => ({
                    ...prevUsers,
                    [userID]: data.userName,
                }));
            })
            .catch((error) => {
                console.error("Error fetching user information:", error);
            });
    };

    // Function to fetch shop information
    const fetchShop = (shopID) => {
        fetch(`/getShop/${shopID}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setShops((prevShops) => ({
                    ...prevShops,
                    [shopID]: data.shopName,
                }));
            })
            .catch((error) => {
                console.error("Error fetching shop information:", error);
            });
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/updateOrderStatus/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ orderStatus: newStatus }),
            });

            if (response.status === 200) {
                console.log(`Order status updated to ${newStatus}`);
                toast.success(`Order status updated to ${newStatus}`);

                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, orderStatus: newStatus } : order
                    )
                );
            } else {
                console.log("Failed to update order status");
                toast.error("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    useEffect(() => {
        // Initialize DataTables
        const datatables = document.querySelectorAll('.datatable');
        datatables.forEach((datatable) => {
            new DataTable(datatable);
        });
    
        // Initialize Bootstrap dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach((dropdown) => {
            new bootstrap.Dropdown(dropdown);
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
                                            <th scope="col">User Name</th>
                                            <th scope="col">Shop Name</th>
                                            <th scope="col">Order Date</th>
                                            <th scope="col">Total Amount</th>
                                            <th scope="col">Order Status</th>
                                            <th scope="col">Payment Status</th>
                                            <th scope="col">Change Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice().reverse().map((order, index) => (

                                            <tr key={order._id}>
                                                <td>{index + 1}</td>
                                                <td>Order - {orders.length - index }</td>
                                                <td>{users[order.userID]}</td>
                                                <td>{shops[order.shopID]}</td>
                                                <td>{orderDates[orders.length - index - 1]}</td>
                                                <td>{order.totalAmount}</td>
                                                <td>{order.orderStatus}</td>
                                                <td>{order.paymentStatus}</td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary dropdown-toggle" type="button" id={`statusDropdown-${order._id}`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Change Status
                                                        </button>
                                                        <div className="dropdown-menu" aria-labelledby={`statusDropdown-${order._id}`}>
                                                            <button className="dropdown-item" onClick={() => handleStatusChange(order._id, 'Pending')}>Pending</button>
                                                            <button className="dropdown-item" onClick={() => handleStatusChange(order._id, 'Working')}>Working</button>
                                                            <button className="dropdown-item" onClick={() => handleStatusChange(order._id, 'Completed')}>Completed</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Orderrecord;
