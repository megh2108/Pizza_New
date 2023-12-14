import React, { useState, useContext, useEffect } from 'react'
import './Addtopping.css'
import { DataTable } from 'simple-datatables';
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Addtopping = () => {
    const navigate = useNavigate();
    const [toppingName, setToppingName] = useState('');
    const [price, setPrice] = useState('');
    const [items, setItems] = useState([]);


    const [updateMode, setUpdateMode] = useState(false);
    const [itemIdToUpdate, setItemIdToUpdate] = useState(null);

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

        fetch("/getItemsss", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setItems(data);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
            });
    }, []);


    const handleDelete = async (itemId) => {
        try {
            const response = await fetch(`/deleteTopping/${itemId}`, {
                method: "DELETE"
            });

            if (response.status === 200) {
                console.log("Item deleted successfully");
                toast.success("Item deleted successfully");

                setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
            } else {
                console.log("Failed to delete item");
                toast.error("Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleUpdate = (item) => {
        setToppingName(item.toppingName);
        setPrice(item.price);

        setUpdateMode(true);
        setItemIdToUpdate(item._id);
    };

    const handleCancelUpdate = () => {
        setToppingName('');
        setPrice('');
        setUpdateMode(false);
        setItemIdToUpdate(null);
    };

    const handleUpdateItem = async () => {
        const updatePayload = {
            toppingName,
            price,
        };

        try {
            const response = await fetch(`/updateToppings/${itemIdToUpdate}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(updatePayload),
            });

            if (response.status === 200) {
                console.log('Item updated successfully');
                toast.success('Item updated successfully');

                const updatedItem = await response.json();

                setItems((prevItems) =>
                    prevItems.map((prevItem) =>
                        prevItem._id === updatedItem._id ? updatedItem : prevItem
                    )
                );

                setUpdateMode(false);
                setItemIdToUpdate(null);
                setToppingName('');
                setPrice('');
            } else if (response.status === 404) {
                console.log('Topping not found');
                toast.error('Topping not found');
            } else if (response.status === 500) {
                console.log('Internal server error');
                toast.error('Internal server error');
            } else {
                console.log('Failed to update item');
                toast.error('Failed to update item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const submitAdmin = async (e) => {
        e.preventDefault();

        const res = await fetch('/addTopping', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                toppingName,
                price

            }),
        });

        const data = await res.json();

        if (res.status === 400 || !data) {
            toast.error("Invalid Item");
            console.log("Invalid Item");
        } else if (res.status === 200) {

            toast.success("Successfully Topping added");
            //   navigate("/Dashboard");
        }


    }
    useEffect(() => {
        const datatables = document.querySelectorAll('.datatable');

        datatables.forEach(datatable => {
            new DataTable(datatable);
        });
    }, []);
    return (
        <>
            <section className="section register min-vh-100 d-flex flex-column align-items-center  py-4" id="section">
                <div className="container">
                    <div className="row ">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center ">



                            <div className="card mb-3">

                                <div className="card-body">

                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">{updateMode ? 'Update Topping' : 'Topping Add'}</h5>
                                        <p className="text-center small">Add Topping from Admin Side</p>
                                    </div>

                                    <form className="row g-3 needs-validation" >

                                        <div className="col-12">
                                            <label for="yourUsername" className="form-label">Topping Name</label>
                                            <input type="text" name="toppingName" className="form-control" id="yourUsername" required
                                                value={toppingName}
                                                onChange={(e) => setToppingName(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label for="yourUsername" className="form-label">Toping Price</label>
                                            <input type="text" name="price" className="form-control" id="yourUsername" required
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                        </div>


                                        {updateMode ? (
                                            <>

                                                <div className="col-6">
                                                    <button className="btn btn-primary w-100" type="button" onClick={handleCancelUpdate}> Cancel Update</button>
                                                </div>
                                                <div className="col-6">
                                                    <button className="btn btn-primary w-100" type="button" onClick={handleUpdateItem}> Update Topping</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>


                                                <div className="col-12">
                                                    <button className="btn btn-primary w-100" type="button" onClick={submitAdmin}>Add Topping</button>
                                                </div>
                                            </>
                                        )}

                                    </form>

                                </div>
                            </div>


                        </div>

                        <div class="col-lg-8 ">

                            <div class="card justify-content-center">
                                <div class="card-body">
                                    <h5 class="card-title col-lg-12">Records of Toppings</h5>
                                    <div className="table-responsive">

                                        <table class="table table-bordered datatable">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Sr No.</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Price</th>
                                                    <th scope="col">Update</th>
                                                    <th scope="col">Delete</th>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {items.map((item, index) => (
                                                    <tr key={item._id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.toppingName}</td>
                                                        <td>{item.price}</td>
                                                        <td>
                                                            <button className="btn btn-primary w-100" type="button" onClick={() => handleUpdate(item)}>Update</button>
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-primary w-100" type="button" onClick={() => handleDelete(item._id)}>Delete</button>

                                                        </td>

                                                    </tr>
                                                ))}


                                            </tbody>
                                        </table>


                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </section>
        </>
    )
}

export default Addtopping
