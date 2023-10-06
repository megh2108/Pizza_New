import React, { useState, useEffect } from 'react'
import './Cart.css'
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Cart = () => {

    const [cartItems, setCartItems] = useState([]);
    const [toppings, setToppings] = useState([]); 
    const [userData, setUserData] = useState([]);

    const [quantity, setQuantity] = useState();
    console.log("hi", cartItems);

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };

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

            setCartItems(res.items);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        callGetCart();
    }, []);

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
                        <div>

                            {cartItems.map((item) => (

                                <div class="col-lg-9" key={item._id} >
                                    <div class="card mb-3">
                                        <div class="row g-0">
                                            <div class="col-md-4">
                                                <img
                                                    src="assets/img/italianpizza.jpg"
                                                    class="img-fluid rounded-start"
                                                    alt="..."
                                                />
                                            </div>
                                            <div class="col-md-8">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <h5 class="card-title col-lg-8">{item.itemName}</h5>

                                                        <button class="btn btn-primary col-lg-4" style={{ "height": "40px", "width": "100px", "margin-top": "5px", "margin-left": "auto" }}>Remove</button>

                                                    </div>
                                                    <div class="row mb-3">
                                                        <div class="col-lg-4">
                                                            <label for="inputState" class="form-label">
                                                                Size
                                                            </label>

                                                            <select id="inputState" class="form-select">
                                                                <option>{item.size}</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-lg-2">
                                                            <label for="yourSecretKey" className="form-label">
                                                                Price
                                                            </label>
                                                            <h5 class="card-text">{item.price}</h5>
                                                        </div>
                                                        <div class="col-lg-3 mt-4">
                                                            <div class="btn-group" role="group" aria-label="Basic outlined example">
                                                                <button type="button" class="btn btn-outline-primary" onClick={decrementQuantity}>-</button>
                                                                <input
                                                                    type="text"
                                                                    name="quantity"
                                                                    className="form-control"
                                                                    id="yourQuantity"
                                                                    value={item.quantity}
                                                                    readOnly
                                                                />
                                                                <button type="button" class="btn btn-outline-primary" onClick={incrementQuantity}>+</button>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-2 ">

                                                            <label for="yourSecretKey" className="form-label">Total Price</label>
                                                            <h5 class="card-text">{item.totalPrice}</h5>
                                                        </div>
                                                    </div>
                                                    <div class="form-check">
                                                        <h5 class="card-text">Toppings</h5>
                                                        <div class="row">
                                                     
                                                            {toppings.map((topping) => (
                                                                <div className="col-lg-2" key={`topping-${topping._id}`}>
                                                                    <label className="form-check-label" htmlFor={`topping-${topping._id}`}>
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            id={`topping-${topping._id}`}
                                                                            value={topping.toppingName}
                                                                        />
                                                                        {topping.toppingName}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                            <div>
                                <button class="btn btn-primary" onClick={placeOrder}>Placed Order</button>
                            </div>
                        </div>

                    )}

                </div>
            </section>
        </>
    )
}

export default Cart

