import React, { useState, useEffect } from 'react'
import { DataTable } from 'simple-datatables';
import './Addpizza.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Addpizza = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState([]);
    const [updateMode, setUpdateMode] = useState(false);
    const [itemIdToUpdate, setItemIdToUpdate] = useState('');
    const [item, setItem] = useState({
        itemName: "",
        description: "",
        sizes: {
            small: { price: "" },
            medium: { price: "" },
            large: { price: "" }
        },
        image: ""
    });

    const navigate = useNavigate();


    useEffect(() => {


        fetch("/getItems", {
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


    const handleInputs = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    const handlePriceInputs = (e, size) => {
        const { name, value } = e.target;
        setItem({
            ...item,
            sizes: {
                ...item.sizes,
                [size]: {
                    ...item.sizes[size],
                    [name]: value
                }
            }
        });
    };

    const handleUpdate = (item) => {
        setUpdateMode(true);
        setItemIdToUpdate(item._id);
        setItem({
            itemName: item.itemName,
            description: item.description,
            sizes: {
                small: { price: item.sizes.small.price },
                medium: { price: item.sizes.medium.price },
                large: { price: item.sizes.large.price },
            },
            image: item.image,
        });
    };

    const handleCancelUpdate = () => {
        setUpdateMode(false);
        setItemIdToUpdate('');
        setItem({
            itemName: '',
            description: '',
            sizes: {
                small: { price: '' },
                medium: { price: '' },
                large: { price: '' },
            },
            image: '',
        });
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();

        const { itemName, description, sizes, image } = item;

        const updatePayload = {
            itemName,
            description,
            sizes,
            image,
        };

        try {
            const response = await fetch(`/updateItems/${itemIdToUpdate}`, {
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
                setItemIdToUpdate('');
                setItem({
                    itemName: '',
                    description: '',
                    sizes: {
                        small: { price: '' },
                        medium: { price: '' },
                        large: { price: '' },
                    },
                    image: '',
                });
            } else if (response.status === 404) {
                console.log('item not found');
                toast.error('item not found');

            }
            else if (response.status === 500) {
                console.log('internal server error');
                toast.error('internal server error');

            } else {
                console.log('Failed to update item');
                toast.error('Failed to update item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            const response = await fetch(`/deleteItems/${itemId}`, {
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

    const convertToBase64 = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            setItem({ ...item, image: reader.result });
        };
        reader.onerror = (error) => {
            console.log("Error: ", error);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const postData = async (e) => {
        e.preventDefault();

        const { itemName, description, sizes, image } = item;

        const response = await fetch("/addItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                itemName,
                description,
                sizes,
                image
            }),
        });

        const res = await response.json();

        if (response.status === 201 || res.message === 'Item added successfully') {
            console.log("Item added successfully");
            toast.success("Item added successfully");

            setItem({
                itemName: "",
                description: "",
                sizes: {
                    small: { price: "" },
                    medium: { price: "" },
                    large: { price: "" }
                },
                image: ""
            });
        } else {
            console.log("Failed to add item");
            toast.error("Failed to add item");
        }
    };


    useEffect(() => {
        const datatables = document.querySelectorAll('.datatable');

        datatables.forEach(datatable => {
            new DataTable(datatable);
        });
    }, []);
    return (
        <>
            <section className="section register min-vh-100 d-flex flex-column align-items-center  py-4" id="register" >
                <div className="container">
                    <div className="row ">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center ">



                            <div className="card mb-3">

                                <div className="card-body">

                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">{updateMode ? 'Update Pizza' : 'Add Pizza'}</h5>
                                        <p className="text-center small">Add Pizza from Admin Side</p>
                                    </div>

                                    <form className="row g-3" >

                                        <div className="col-12">
                                            <label for="yourUsername" className="form-label">Pizza Name</label>
                                            <input type="text" name="itemName" className="form-control" id="yourUsername" required
                                                value={item.itemName} onChange={handleInputs} />
                                        </div>
                                        <div className="col-12">
                                            <label for="yourUsername" className="form-label">Pizza Description</label>
                                            <input type="text" name="description" className="form-control" id="yourUsername" required
                                                value={item.description} onChange={handleInputs}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label for="yourUsername" className="form-label">Small Size Price</label>
                                            <input type="text" name="price" className="form-control" id="yourUsername" required
                                                value={item.sizes.small.price}
                                                onChange={(e) => handlePriceInputs(e, "small")}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label for="yourUsername" className="form-label">Medium Size Price</label>
                                            <input type="text" name="price" className="form-control" id="yourUsername" required
                                                value={item.sizes.medium.price}
                                                onChange={(e) => handlePriceInputs(e, "medium")} />
                                        </div>
                                        <div className="col-md-4">
                                            <label for="yourUsername" className="form-label">Large Size Price</label>
                                            <input type="text" name="price" className="form-control" id="yourUsername" required
                                                value={item.sizes.large.price}
                                                onChange={(e) => handlePriceInputs(e, "large")}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label for="inputNumber" class="form-label">File Upload</label>
                                            <input class="form-control" type="file" id="formFile" accept="image/*" onChange={convertToBase64} />
                                            {item.image && <img width={100} height={100} src={item.image} alt="Preview" />}
                                        </div>



                                        {updateMode ? (
                                            <>

                                                <div className="col-6">
                                                    <button className="btn btn-primary w-100" type="button" onClick={handleCancelUpdate}>Cancel Update</button>
                                                </div>
                                                <div className="col-6">
                                                    <button className="btn btn-primary w-100" type="button" onClick={handleUpdateItem}>Update Item</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>


                                                <div className="col-12">
                                                    <button className="btn btn-primary w-100" type="button" onClick={postData}>Add Pizza</button>
                                                </div>
                                            </>
                                        )}

                                    </form>

                                </div>
                            </div>


                        </div>

                        <div class="col-lg-8">

                            <div class="card justify-content-center">
                                <div class="card-body">


                                    <h5 class="card-title">Records of Pizzaa</h5>
                                    <div className="table-responsive">

                                        <table class="table table-bordered table-sm datatable ">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Sr No.</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Small Price</th>
                                                    <th scope="col">Medium Price</th>
                                                    <th scope="col">Large Price</th>
                                                    <th scope="col">Update</th>
                                                    <th scope="col">Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {items.map((item, index) => (
                                                    <tr key={item._id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.itemName}</td>
                                                        <td>{item.description}</td>
                                                        <td>Rs.{item.sizes.small.price}</td>
                                                        <td>Rs.{item.sizes.medium.price}</td>
                                                        <td>Rs.{item.sizes.large.price}</td>
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

export default Addpizza
