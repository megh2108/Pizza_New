import React,{useState,useEffect} from 'react'
import './Cart.css'

const Cart = () => {

    const [cartItems, setCartItems] = useState([]);

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

            // Set the cart items in state
            setCartItems(res.items);
        } catch (err) {
            console.log(err);
            // Handle errors as needed
        }
    };

    useEffect(() => {
        // Call the API to fetch cart data when the component mounts
        callGetCart();
    }, []);

    return (
        <>

            <section class="section" id="cart">
                <div className="section-header">
                    <p>Your Cart</p>
                </div>
                <div class="container">
                    <div class="col-lg-9">
                        <div class="card mb-3">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img src="assets/img/italianpizza.jpg" class="img-fluid rounded-start" alt="..." />
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <div class="row ">
                                            <h5 class="card-title col-lg-4">Italian Pizza</h5>
                                            <p class="card-text col-lg-8 mt-3">Tis is a Italian Pizza with test.</p>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-lg-4">
                                                <label for="inputState" class="form-label">Size</label>
                                                <select id="inputState" class="form-select">
                                                    <option>Small</option>
                                                    <option>Medium</option>
                                                    <option>Large</option>
                                                </select>
                                            </div>
                                            <div class="col-lg-2">
                                                <label for="yourSecretKey" className="form-label">Price</label>
                                                {/* <input type="text" name="secretkey" className="form-control" id="yourSecretKey" required /> */}
                                                <h5 class="card-text">56</h5>

                                            </div>
                                            <div class="col-lg-3 mt-4">
                                                <div class="btn-group" role="group" aria-label="Basic outlined example">
                                                    <button type="button" class="btn btn-outline-primary">-</button>
                                                    <input type="password" name="password" className="form-control" id="yourPassword" placeholder='1' required />
                                                    <button type="button" class="btn btn-outline-primary">+</button>
                                                </div>
                                            </div>
                                            <div class="col-lg-2 ">

                                                <label for="yourSecretKey" className="form-label">Total Price</label>
                                                {/* <input type="text" name="secretkey" className="form-control" id="yourSecretKey" required /> */}
                                                <h5 class="card-text">56</h5>
                                            </div>
                                        </div>
                                        <div class="form-check">
                                            <h5 class="card-text">Toppings</h5>
                                            <div class="row">
                                                <div class="col-lg-2">
                                                    <label class="form-check-label" for="gridCheck1">
                                                        <input class="form-check-input" type="checkbox" id="gridCheck1" />
                                                        Cheese
                                                    </label>
                                                </div>
                                                <div class="col-lg-2">
                                                    <label class="form-check-label" for="gridCheck1">
                                                        <input class="form-check-input" type="checkbox" id="gridCheck1" />
                                                        Butter
                                                    </label>
                                                </div>
                                                <div class="col-lg-2">
                                                    <label class="form-check-label" for="gridCheck1">
                                                        <input class="form-check-input" type="checkbox" id="gridCheck1" />
                                                        Extra Butter
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="col-lg-9">
                        <div class="card mb-3">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img src="assets/img/italianpizza.jpg" class="img-fluid rounded-start" alt="..." />
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <div class="row ">
                                            <h5 class="card-title col-lg-4">Italian Pizza</h5>
                                            <p class="card-text col-lg-8 mt-3">Tis is a Italian Pizza with test.</p>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-lg-4">
                                                <label for="inputState" class="form-label">Size</label>
                                                <select id="inputState" class="form-select">
                                                    <option>Small</option>
                                                    <option>Medium</option>
                                                    <option>Large</option>
                                                </select>
                                            </div>
                                            <div class="col-lg-2">
                                                <label for="yourSecretKey" className="form-label">Price</label>
                                                {/* <input type="text" name="secretkey" className="form-control" id="yourSecretKey" required /> */}
                                                <h5 class="card-text">56</h5>

                                            </div>
                                            <div class="col-lg-3 mt-4">
                                                <div class="btn-group" role="group" aria-label="Basic outlined example">
                                                    <button type="button" class="btn btn-outline-primary">-</button>
                                                    <input type="password" name="password" className="form-control" id="yourPassword" placeholder='1' required />
                                                    <button type="button" class="btn btn-outline-primary">+</button>
                                                </div>
                                            </div>
                                            <div class="col-lg-2 ">

                                                <label for="yourSecretKey" className="form-label">Total Price</label>
                                                {/* <input type="text" name="secretkey" className="form-control" id="yourSecretKey" required /> */}
                                                <h5 class="card-text">56</h5>
                                            </div>
                                        </div>
                                        <div class="form-check">
                                            <h5 class="card-text">Toppings</h5>
                                            <div class="row">
                                                <div class="col-lg-2">
                                                    <label class="form-check-label" for="gridCheck1">
                                                        <input class="form-check-input" type="checkbox" id="gridCheck1" />
                                                        Cheese
                                                    </label>
                                                </div>
                                                <div class="col-lg-2">
                                                    <label class="form-check-label" for="gridCheck1">
                                                        <input class="form-check-input" type="checkbox" id="gridCheck1" />
                                                        Butter
                                                    </label>
                                                </div>
                                                <div class="col-lg-2">
                                                    <label class="form-check-label" for="gridCheck1">
                                                        <input class="form-check-input" type="checkbox" id="gridCheck1" />
                                                        Extra Butter
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {cartItems.map((item) => (
                        <div class="col-lg-9" key={item._id}>
                            <div class="card mb-3">
                                <div class="row g-0">
                                    {/* Render cart item details here */}
                                    <div class="col-md-4">
                                        {/* Render item image */}
                                        <img
                                            src="assets/img/italianpizza.jpg"
                                            class="img-fluid rounded-start"
                                            alt="..."
                                        />
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <div class="row">
                                                <h5 class="card-title col-lg-4">{item.itemName}</h5>
                                                <p class="card-text col-lg-8 mt-3">{item.description}</p>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-lg-4">
                                                    <label for="inputState" class="form-label">
                                                        Size
                                                    </label>
                                                    <select id="inputState" class="form-select">
                                                        <option>{item.size}</option>
                                                        {/* Add other size options here */}
                                                    </select>
                                                </div>
                                                <div class="col-lg-2">
                                                    <label for="yourSecretKey" className="form-label">
                                                        Price
                                                    </label>
                                                    <h5 class="card-text">{item.price}</h5>
                                                </div>
                                                {/* Add quantity and total price here */}
                                            </div>
                                            <div class="form-check">
                                                <h5 class="card-text">Toppings</h5>
                                                {/* Render toppings checkboxes here */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div>

                        <a href="#" class="btn btn-primary">Placed Order</a>
                    </div>
                </div>
                {/* </div> */}
            </section >
        </>
    )
}

export default Cart
