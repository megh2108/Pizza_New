import React, { useState, useEffect } from 'react'
import './Cart.css'
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Cart = () => {

    const [cartItems, setCartItems] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [userData, setUserData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0); 
    

  

    const callGetCart = async () => {
        try {
            const response = await fetch('/getcart', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const res = await response.json();
            console.log(res);

            if (!response.ok) {
                const error = new Error(res.error);
                throw error;
            }

            // setCartItems(res.items);
            const cartItemsWithDate = res.items.map((item) => ({
                ...item,
                dateAdded: new Date(),
            }));

            setCartItems(cartItemsWithDate);
        } catch (err) {
            console.log(err);
        }
    };

    
    const fetchToppings = async () => {
        try {
            const response = await fetch('/gettoppings');
            const data = await response.json();
            setToppings(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        callGetCart();
        fetchToppings();
    }, []);

    useEffect(() => {
        const newTotalPrice = cartItems.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);

        setTotalPrice(newTotalPrice);
    }, [cartItems]);

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

    const placeOrder = async () => {

        const stripe = await loadStripe("pk_test_51NxuORSJjSNbQ9depnPh6Xjoaa9mKEKutlw3t2yWEZiT2DuCeJ3enVXqmaHNlg6kpXh0bbNFOgbw2232Mj2l0Rf200r3oVFkcD");

        const body = {
            products: cartItems
        };

        const answer = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const session = await answer.json();
        const result = stripe.redirectToCheckout({
            sessionId: session.id
        });



        if (result) {
            try {
                const response = await fetch('/order', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to place the order');
                }

                console.log('Order placed successfully:', data.message);
                toast.success('Order placed successfully');

            } catch (error) {
                console.error('Error placing order:', error.message);
                toast.error('Order not placed successfully');

            }
        }
        else {
            console.log(result.error);
            toast.error(result.error);
        }

    }



    return (
        <>

            <section class="section" id="cart">
                <div className="section-header">
                    <p>Your Cart</p>
                </div>
                <div class="container">
                    {cartItems.length === 0 ? (
                        <div className="text-center">
                            <p><span>Your cart is empty.</span></p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table class="table table-bordered ">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sr No.</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Item Name</th>
                                            <th scope="col">Size</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Qty</th>
                                            <th scope="col">Total Price</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => (

                                            <tr key={item._id}>
                                                <th scope="row">{index + 1}</th>
                                                <td> <img
                                                    src="assets/img/italianpizza.jpg"
                                                    class="img-fluid rounded-start"
                                                    alt="..." style={{ "height": "150px", "width": "150px" }}
                                                /></td>
                                                <td>{item.itemName}</td>
                                                <td>{item.size}</td>
                                                <td>{item.price}</td>
                                                <td > <button type="button" class="btn btn-outline-primary" id="qty">-</button>
                                                    <input
                                                        type="text"
                                                        name="quantity"
                                                        className="form-control"
                                                        id="yourcartQuantity"
                                                        value={item.quantity}
                                                        readOnly
                                                    />
                                                    <button type="button" class="btn btn-outline-primary" id="qty">+</button></td>
                                                <td>{item.totalPrice}</td>


                                            </tr>
                                        ))
                                        }



                                    </tbody>
                                </table>
                            </div>
                            <div className="table-responsive">

                                <table class="table table-bordered ">
                                    <tbody>
                                        <tr>
                                            <td>Total Price</td>
                                            <td>{totalPrice}</td>
                                        </tr>
                                        <tr>
                                            <td>Discount Price</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td>Total Price</td>
                                            <td>{totalPrice}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}> <button class="btn btn-primary" onClick={placeOrder}>Placed Order</button> </td>
                                        </tr>


                                    </tbody>
                                </table>
                            </div>

                        </>

                    )}

                </div>
            </section>
        </>
    )
}

export default Cart

