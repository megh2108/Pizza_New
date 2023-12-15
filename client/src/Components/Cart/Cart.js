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
    const [disPrice, setDisPrice] = useState(0);
    const [disAmount, setDisAmount] = useState(0);
    const [activeOffer, setActiveOffer] = useState([]);



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
                totalPrice: item.price * item.quantity,

            }));

            setCartItems(cartItemsWithDate);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchActiveOffer = async () => {
        try {
            const response = await fetch('/getactiveoffer', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const res = await response.json();
            console.log('Response from /getactiveoffer:', res);

            if (!response.ok) {
                const error = new Error(res.error);
                throw error;
            }

            if (res.length > 0) {
                // Choose the offer with the highest discount percentage
                const maxDiscountOffer = res.reduce((maxOffer, currentOffer) => {
                    return currentOffer.discountPercentage > maxOffer.discountPercentage ? currentOffer : maxOffer;
                });

                setActiveOffer({
                    offer: maxDiscountOffer,
                    offerName: maxDiscountOffer.offerName,
                });
            } else {
                // No active offers
                setActiveOffer(null);
            }

        } catch (err) {
            console.error(err);
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
        fetchActiveOffer();

    }, []);
    // console.log("Active Offer:", activeOffer);

    useEffect(() => {
        const newTotalPrice = cartItems.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);

        setTotalPrice(newTotalPrice);


    }, [cartItems]);

    useEffect(() => {
        console.log("Active Offer:", activeOffer);
        console.log("Total Price:", totalPrice);

        if (activeOffer && activeOffer.offer) {
            const discountAmount = (totalPrice * activeOffer.offer.discountPercentage) / 100;
            const discountedPrice = totalPrice - discountAmount;

            console.log("Discount Amount:", discountAmount);
            console.log("Discounted Price:", discountedPrice);

            setDisAmount(discountAmount);
            setDisPrice(discountedPrice);
        } else {
            console.log("No Active Offer");
            // If there is no active offer, reset the discount values
            setDisAmount(0);
            setDisPrice(0);
        }
    }, [activeOffer, totalPrice]);


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
            products: cartItems,
            discountPrice: disPrice
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
                    body: JSON.stringify({ discountPrice: disPrice }) // Include disPrice in the request body

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

    const handleDelete = async (itemId) => {
        try {
            // Make a DELETE request to your backend endpoint to delete the item
            const response = await fetch(`/deleteCartItem/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete item');
            }

            // Refresh the cart after successful deletion
            callGetCart();
        } catch (error) {
            console.error('Error deleting item:', error.message);
            toast.error('Item not deleted successfully');
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        newQuantity = Math.max(newQuantity, 1);

        try {
            // Make a PATCH request to your backend endpoint to update the quantity
            const response = await fetch(`/updateCartItemQuantity/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ quantity: newQuantity }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update quantity');
            }

            // Refresh the cart after successful update
            callGetCart();
        } catch (error) {
            console.error('Error updating quantity:', error.message);
            toast.error('Quantity not updated successfully');
        }
    };




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
                                            <th scope="col">Actions</th>


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

                                                <td style={{ display: "flex" }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        name="quantity"
                                                        className="form-control"
                                                        id="yourcartQuantity"
                                                        value={item.quantity}
                                                        readOnly
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </td>
                                                <td>{item.totalPrice}</td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => handleDelete(item._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>


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
                                            <td colSpan={2}>Total Price</td>
                                            <td>{totalPrice}</td>
                                        </tr>
                                        <tr>
                                            <td>{activeOffer.offerName} Offer</td>
                                            <td>Discount Amount</td>
                                            <td>{disAmount}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>Discount Price</td>
                                            <td>{disPrice}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3}> <button class="btn btn-primary" onClick={placeOrder}>Placed Order</button> </td>
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

