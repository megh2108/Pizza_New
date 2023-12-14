import React, { useState, useEffect } from 'react'
import { DataTable } from 'simple-datatables';
// import './Addpizza.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addoffer = () => {

    const navigate = useNavigate();


    const [updateMode, setUpdateMode] = useState(false);
    const [itemIdToUpdate, setItemIdToUpdate] = useState(null);

    const [offer, setOffer] = useState([]);


    const [offerName, setOfferName] = useState('');
    const [shopID, setShopid] = useState('');
    const [discountPercentage, setDiscount] = useState('');
    const [isActive, setActive] = useState('');
    const [items, setItems] = useState([]);


    useEffect(() => {
        const datatables = document.querySelectorAll('.datatable');

        datatables.forEach(datatable => {
            new DataTable(datatable);
        });
    }, []);

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

        fetch("/getOfferItems", {
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



    const postData = async (e) => {
        e.preventDefault();

        // const { shopid, offername, discount, active } = item;

        const res = await fetch("/addOffer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                shopID,
                offerName,
                discountPercentage,
                isActive
            }),
        });

        const data = await res.json();

        if (res.status === 400 || !data) {
            toast.error("Invalid Item");
            console.log("Invalid Item");
        } else if (res.status === 200) {

            toast.success("Successfully Offer added");
            //   navigate("/Dashboard");
        }
    };

    const handleUpdate = (item) => {
        // setToppingName(item.toppingName);
        // setPrice(item.price);

        setActive(item.isActive);
        setDiscount(item.discountPercentage);
        setShopid(item.shopID);
        setOfferName(item.offerName);

        setUpdateMode(true);
        setItemIdToUpdate(item._id);
    };

    const handleCancelUpdate = () => {
        setActive('');
        setDiscount('');
        setShopid('');
        setOfferName('');
        setUpdateMode(false);
        setItemIdToUpdate(null);
    };

    const handleUpdateItem = async () => {
        const updatePayload = {
            shopID,
            offerName,
            discountPercentage,
            isActive
        };

        try {
            const response = await fetch(`/updateOffer/${itemIdToUpdate}`, {
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
                setActive('');
                setDiscount('');
                setShopid('');
                setOfferName('');
            } else if (response.status === 404) {
                console.log('Offer not found');
                toast.error('Offer not found');
            } else if (response.status === 500) {
                console.log('Internal server error');
                toast.error('Internal server error');
            } else {
                console.log('Failed to update offer');
                toast.error('Failed to update offer');
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            const response = await fetch(`/deleteOffer/${itemId}`, {
                method: "DELETE"
            });

            if (response.status === 200) {
                console.log("Offer deleted successfully");
                toast.success("Offer deleted successfully");

                setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
            } else {
                console.log("Failed to delete Offer");
                toast.error("Failed to delete Offer");
            }
        } catch (error) {
            console.error("Error deleting Offer:", error);
        }
    };


    const handleStatusChange = async (itemId, newStatus) => {
        try {
            const response = await fetch(`/updateOfferStatus/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (response.status === 200) {
                console.log(`Offer status updated to ${newStatus}`);
                toast.success(`Offer status updated to ${newStatus}`);

                setOffer((prevOffer) =>
                    prevOffer.map((offer) =>
                        offer._id === itemId ? { ...offer, isActive: newStatus } : offer
                    )
                );
            } else {
                console.log("Failed to update order status");
                toast.error("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <>

            <section className="section register min-vh-100 d-flex flex-column align-items-center  py-4" id="register" >
                <div className="container">
                    <div className="row ">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center ">



                            <div className="card mb-3">

                                <div className="card-body">

                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">{updateMode ? 'Update Offer' : 'Add Offer'}</h5>
                                        <p className="text-center small">Add Offer from Admin Side</p>
                                    </div>

                                    <form className="row g-3" >

                                        <div className="col-12">
                                            <label for="yourUsername" className="form-label">Shop ID</label>
                                            <input type="text" name="shopID" className="form-control" id="yourUsername" required
                                                value={shopID}
                                                onChange={(e) => setShopid(e.target.value)} />
                                        </div>
                                        <div className="col-12">
                                            <label for="yourUsername" className="form-label">Offer Name</label>
                                            <input type="text" name="offerName" className="form-control" id="yourUsername" required
                                                value={offerName}
                                                onChange={(e) => setOfferName(e.target.value)} />
                                        </div>
                                        <div className="col-6">
                                            <label for="yourUsername" className="form-label">Discount (%)</label>
                                            <input type="text" name="discountPercentage" className="form-control" id="yourUsername" required
                                                value={discountPercentage}
                                                onChange={(e) => setDiscount(e.target.value)} />
                                        </div>
                                        <div className="col-6">
                                            <label for="yourUsername" className="form-label">Active (true/false)</label>
                                            <input type="text" name="isActive" className="form-control" id="yourUsername" required
                                                value={isActive}
                                                onChange={(e) => setActive(e.target.value)} />
                                        </div>



                                        {updateMode ? (
                                            <>

                                                <div className="col-6">
                                                    <button className="btn btn-primary w-100" type="button" onClick={handleCancelUpdate}> Cancel Update</button>
                                                </div>
                                                <div className="col-6">
                                                    <button className="btn btn-primary w-100" type="button" onClick={handleUpdateItem}> Update Offer</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>


                                                <div className="col-12">
                                                    <button className="btn btn-primary w-100" type="button" onClick={postData}>Add Offer</button>
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


                                    <h5 class="card-title">Records of Offers</h5>
                                    <div className="table-responsive">

                                        <table class="table table-bordered table-sm datatable ">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Sr No.</th>
                                                    <th scope="col">Offer Name</th>
                                                    <th scope="col">Discount(%)</th>
                                                    <th scope="col">Active</th>
                                                    <th scope="col">Active Status</th>
                                                    <th scope="col">Update</th>
                                                    <th scope="col">Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {items.map((item, index) => (
                                                    <tr key={item._id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.offerName}</td>
                                                        <td>{item.discountPercentage}</td>
                                                        <td>{item.isActive.toString()}</td>
                                                        <td>
                                                            <div className="dropdown">
                                                                <button className="btn btn-secondary dropdown-toggle" type="button" id={`statusDropdown-${item._id}`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    Active Status
                                                                </button>
                                                                <div className="dropdown-menu" aria-labelledby={`statusDropdown-${item._id}`}>
                                                                    <button className="dropdown-item" onClick={() => handleStatusChange(item._id, true)}>Active</button>
                                                                    <button className="dropdown-item" onClick={() => handleStatusChange(item._id, false)}>Non-Active</button>

                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <button className="btn btn-primary w-100" type="button" onClick={() => handleUpdate(item)}>Update</button>
                                                            {/* <button className="btn btn-primary w-100" type="button" onClick={() => handleUpdate(item)}>Update</button> */}
                                                        </td>
                                                        <td>
                                                            {/* <button className="btn btn-primary w-100" type="button" >Delete</button> */}
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

export default Addoffer
