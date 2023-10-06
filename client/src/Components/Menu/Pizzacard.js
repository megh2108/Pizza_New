import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const PizzaCard = ({ pizza }) => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('small');



    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };

    const addToCart = async () => {
        const data = {
            itemName: pizza.itemName,
            size: selectedSize,  
            quantity: quantity
        };

        try {
            const response = await fetch('/addtocart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const res = await response.json();
            console.log(response.status);

            if (response.status === 500 || !res) {
                toast.error("Failed to add Item to cart");
                console.log("Failed to add  Item to cart");
            }
            else if (response.status === 400) {
                toast.error("Invalid size selected");
                console.log("Invalid size selected");
            }
            else if (response.status === 401) {
                toast.error("Please Login");
                console.log("Please Login");
                navigate("/login");
            }
            else if (response.status === 404) {
                toast.error("Menu item not found");
                console.log("Menu item not found");
            }
            else if (response.status === 201) {
                toast.success("Item added to cart successfully");
                console.log("Item added to cart successfully");
            }
            else {
                toast.error("Internal Error");
                console.log("Internal Error");
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="col-lg-3" key={pizza.id}>
            <div className="card">
                <img src={pizza.image} className="card-img-top" alt={pizza.name} />
                <div className="card-body">
                    <h5 className="card-title">{pizza.itemName}</h5>
                    <p className="card-text">{pizza.description}</p>
                    <div className="row mb-3">
                        <div className="col-lg-6">
                            <label htmlFor="inputSize" className="form-label">Size</label>

                            <select
                                id="inputSize"
                                className="form-select"
                                value={selectedSize}
                                onChange={(e) => {
                                    setSelectedSize(e.target.value);
                                }}
                            >
                                {Object.keys(pizza.sizes).map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-lg-6">
                            <label htmlFor="yourPrice" className="form-label">Price</label>
                            <h5 className="card-text">{pizza.sizes[selectedSize].price}</h5>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="btn-group" role="group" aria-label="Basic outlined example">
                                <button type="button" className="btn btn-outline-primary" onClick={decrementQuantity}>-</button>
                                <input
                                    type="text"
                                    name="quantity"
                                    className="form-control"
                                    id="yourQuantity"
                                    value={quantity}
                                    readOnly
                                />
                                <button type="button" className="btn btn-outline-primary" onClick={incrementQuantity}>+</button>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="btn btn-primary" onClick={addToCart}>
                                Add to Cart
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PizzaCard;
