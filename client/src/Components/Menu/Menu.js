import React, { useEffect, useState } from 'react'
import './Menu.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';



const Menu = () => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedSize, setSelectedSize] = useState('small'); // Default selected size
    const [quantity, setQuantity] = useState(1); // Quantity state




    const addToCart = async (pizza, size, quantity) => {

        const data = {
            itemName: pizza.itemName,
            size: size,
            quantity: quantity
        };

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
            toast.error ("Failed to add Item to cart");
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


    };

    const callMenuPage = async () => {
        try {
            const response = await fetch("/pizza", {
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

    const decrementQuantity = () => {

        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Function to handle incrementing quantity
    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };
    
   

    // const handleSizeChange = (event) => {
    //     setSelectedSize(event.target.value);
    // }

    // // Find the selected pizza menu item based on the selected size
    // const selectedPizza = menuItems.find((pizza) => pizza.sizes[selectedSize]);
    return (
        <>
            <section class="section" >
                <div class="container">


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
                                <h4>Sendwiches</h4>
                            </a>
                        </li>


                        <li className="nav-item">
                            <a className="nav-link" data-bs-toggle="tab" data-bs-target="#menu-burgers">
                                <h4>Burgers</h4>
                            </a>
                        </li>



                    </ul>

                    <div className="tab-content" data-aos="fade-up" data-aos-delay="300">

                        <div className="tab-pane fade active show" id="menu-pizzas">

                            {/* <div className="tab-header text-center">
                                <h3>Pizza</h3>
                            </div> */}


                            <div class="row ">

                                <div class="col-lg-3 ">
                                    <div class="card ">
                                        <img src="assets/img/italianpizza.jpg" class="card-img-top" alt="..." />
                                        <div class="card-body">
                                            <h5 class="card-title">Italian Pizza</h5>
                                            <p class="card-text">Tis is a Italian Pizza with test.</p>
                                            <div class="row mb-3">
                                                <div class="col-lg-6">
                                                    <label for="inputState" class="form-label">Size</label>
                                                    <select id="inputState" class="form-select">
                                                        <option>Small</option>
                                                        <option>Medium</option>
                                                        <option>Large</option>
                                                    </select>
                                                </div>
                                                <div class="col-lg-6">
                                                    <label for="yourSecretKey" className="form-label">Price</label>
                                                    {/* <input type="text" name="secretkey" className="form-control" id="yourSecretKey" required /> */}
                                                    <h5 class="card-text">56</h5>

                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <div class="btn-group" role="group" aria-label="Basic outlined example">
                                                        <button type="button" class="btn btn-outline-primary">-</button>
                                                        <input type="password" name="password" className="form-control" id="yourPassword" placeholder='1' required />
                                                        <button type="button" class="btn btn-outline-primary">+</button>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">

                                                    <a href="#" class="btn btn-primary">Add to Cart</a>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {userData.map((menuItem) => (
                                    <div className="col-lg-3" key={menuItem.id}>
                                        <div className="card">
                                            <img src={menuItem.image} className="card-img-top" alt={menuItem.name} />
                                            <div className="card-body">
                                                <h5 className="card-title">{menuItem.itemName}</h5>
                                                <p className="card-text">{menuItem.description}</p>
                                                <div className="row mb-3">
                                                    <div className="col-lg-6">
                                                        <label htmlFor="inputState" className="form-label">Size</label>
                                                        <select
                                                            id="inputSize"
                                                            className="form-select"
                                                        // value={selectedSize}
                                                        // onChange={handleSizeChange}
                                                        >
                                                            <option value="small">Small</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="large">Large</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label htmlFor="yourSecretKey" className="form-label">Price</label>
                                                        <h5 className="card-text">56</h5>
                                                    </div>

                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        {/* <div className="btn-group" role="group" aria-label="Basic outlined example">
                                                            <button type="button" className="btn btn-outline-primary">-</button>
                                                            <input type="password" name="password" className="form-control" id="yourPassword" placeholder='1' required />
                                                            <button type="button" className="btn btn-outline-primary">+</button>
                                                        </div> */}
                                                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                                                            <button type="button" className="btn btn-outline-primary" onClick={decrementQuantity}>
                                                                -
                                                            </button>
                                                            <input
                                                                type="text"
                                                                name="quantity"
                                                                className="form-control"
                                                                id="yourQuantity"
                                                                value={quantity}
                                                                readOnly
                                                            />
                                                            <button type="button" className="btn btn-outline-primary" onClick={incrementQuantity}>
                                                                +
                                                            </button>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <a href="#" className="btn btn-primary">Add to Cart</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}



                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Menu
