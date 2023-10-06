import React, { useState, useEffect } from 'react';
import { DataTable } from 'simple-datatables';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orderrecord = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("/getorder", {
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

                // Update the local orders list with the new status
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

                            <table className="table table-bordered datatable">
                                <thead>
                                    <tr>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">User ID</th>
                                        <th scope="col">Shop ID</th>
                                        <th scope="col">Order Date</th>
                                        <th scope="col">Total Amount</th>
                                        <th scope="col">Order Status</th>
                                        <th scope="col">Payment Status</th>
                                        <th scope="col">Change Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.userID}</td>
                                            <td>{order.shopID}</td>
                                            <td>{order.orderDate}</td>
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
            </section>
        </>
    );
};

export default Orderrecord;
