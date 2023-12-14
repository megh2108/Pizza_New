import React, { useEffect, useState } from 'react'

const Yourorder = () => {

    const [userOrders, setUserOrders] = useState([]);
    const [orderDates, setOrderDates] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [loading, setLoading] = useState(true);


    const callOrderPage = async () => {
        try {
            const response = await fetch("/getuserorder", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const res = await response.json();
            setUserOrders(res.userOrderDetails);
            setOrderDates(res.orderDates);
            setOrderStatus(res.orderStatus.reverse());
            setLoading(false);

            console.log(res);

            if (!response.ok) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        callOrderPage();
    }, []);


    return (
        <>
            <section className="section" id="my-orders" style={{ "min-height": "100vh" }}>
                <div className="section-header">
                    <p>My Orders</p>
                </div>
                {loading ? (
                    <h4 style={{ "text-align": "center" }}>  Loading...</h4>
                ) : (
                    <div className="container">
                        {userOrders.slice().reverse().map((order, index) => (
                            <div key={index}>
                                <h4 style={{ "text-align": "center" }}>Date: {orderDates[userOrders.length - index - 1]}</h4>
                                <h4 style={{ "text-align": "center" }}>Order Status: {orderStatus[index]}</h4>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Sr. No.</th>
                                            <th>Item Name</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, itemIndex) => (
                                            <tr key={itemIndex}>
                                                <td>{itemIndex + 1}</td>
                                                <td>{item.itemName}</td>
                                                <td>{item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}



                    </div>
                )}
            </section>
        </>
    )
}

export default Yourorder
