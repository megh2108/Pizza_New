import React, { useState, useEffect } from 'react';
import { DataTable } from 'simple-datatables';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Userdetail = () => {
    const [users, setUsers] = useState([]);


    useEffect(() => {
        fetch("/getuserdetail", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);

              
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    }, []);

   


    useEffect(() => {
        const datatables = document.querySelectorAll('.datatable');

        datatables.forEach((datatable) => {
            new DataTable(datatable);
        });
    }, []);

    return (
        <>
            <section className="section register min-vh-100 d-flex flex-column align-items-center py-4" id="section">
                <div className="container">
                    <div className="card justify-content-center">
                        <div className="card-body">
                            <h5 className="card-title col-lg-12">Order Records</h5>
                            <div className="table-responsive">
                                <table className="table table-bordered datatable">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sr No.</th>
                                            <th scope="col">User Name</th>
                                            <th scope="col">Email ID</th>
                                            <th scope="col">Contact No.</th>
                                            <th scope="col">User Type</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.slice().reverse().map((user,index) => (
                                            <tr key={user._id}>
                                                <td>{index+1}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.type}</td>
                                               
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Userdetail
