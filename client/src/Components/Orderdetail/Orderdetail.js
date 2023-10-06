import React, { useState, useEffect } from 'react';
import { DataTable } from 'simple-datatables';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orderdetails = () => {
    const [orders, setOrders] = useState([]);

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

                            <table className="table table-bordered datatable">
                                <thead>
                                    <tr>
                                        <th scope="col">OrderDetail ID</th>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Item Name</th>
                                        <th scope="col">Size</th>
                                        <th scope="col">Quantity</th>
                                        {/* <th scope="col">Shop ID</th>
                                        <th scope="col">Order Date</th>
                                        <th scope="col">Total Amount</th>
                                        <th scope="col">Order Status</th>
                                        <th scope="col">Payment Status</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.orderID}</td>
                                            
                                            <td>
                                                    {order.items.map((item, index) => (
                                                        <div key={index}>{item.itemName}</div>
                                                    ))}
                                            </td>
                                            <td>
                                                    {order.items.map((item, index) => (
                                                        <div key={index}>{item.size}</div>
                                                    ))}
                                            </td>
                                            <td>
                                                    {order.items.map((item, index) => (
                                                        <div key={index}>{item.quantity} </div>
                                                    ))}
                                            </td>
                                            {/* <td>{order.shopID}</td>
                                            <td>{order.orderDate}</td>
                                            <td>{order.totalAmount}</td>
                                            <td>{order.orderStatus}</td>
                                            <td>{order.paymentStatus}</td> */}

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

export default Orderdetails;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const Orderdetail = () => {
//     const { orderID } = useParams();
//     const [orderDetail, setOrderDetail] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchOrderDetail = async () => {
//             try {
//                 const response = await fetch(`/getOrderDetail/${orderID}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch order detail');
//                 }
//                 const data = await response.json();
//                 setOrderDetail(data);
//                 setLoading(false);
//             } catch (err) {
//                 setError(err);
//                 setLoading(false);
//             }
//         };

//         fetchOrderDetail();
//     }, [orderID]);

//     if (loading) {
//         return <p>Loading order details...</p>;
//     }

//     if (error) {
//         return <p>Error: {error.message}</p>;
//     }

//     return (
//         <div>
//             <h2>Order Details</h2>
//             {orderDetail ? (
//                 <div>
//                     <p>Order ID: {orderDetail.orderID}</p>
//                     <h3>Items</h3>
//                     <ul>
//                         {orderDetail.items.map((item, index) => (
//                             <li key={index}>
//                                 <p>Item Name: {item.itemName}</p>
//                                 <p>Size: {item.size}</p>
//                                 <p>Quantity: {item.quantity}</p>
//                                 {/* You can add more item details here */}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             ) : (
//                 <p>Order detail not found</p>
//             )}
//         </div>
//     );
// };

// export default Orderdetail;
