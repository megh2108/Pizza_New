import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <>
            <aside id="sidebar" class="sidebar">

                <ul class="sidebar-nav" id="sidebar-nav">

                    <li class="nav-item">
                        <NavLink class="nav-link " to="/Dashboard">
                            <i class="bi bi-grid"></i>
                            <span class="span">Dashboard</span>
                        </NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink class="nav-link " to="/Addpizza">
                            <i class="bi bi-grid"></i>
                            <span class="span">Add Pizza</span>
                        </NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink class="nav-link " to="/Addtopping">
                            <i class="bi bi-grid"></i>
                            <span class="span">Add Toppings</span>
                        </NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink class="nav-link " to="/Addoffer">
                            <i class="bi bi-grid"></i>
                            <span class="span">Add Offers</span>
                        </NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink class="nav-link " to="/Orderrecord">
                            <i class="bi bi-grid"></i>
                            <span class="span">Order Records</span>
                        </NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink class="nav-link " to="/Orderdetail">
                            <i class="bi bi-grid"></i>
                            <span class="span">Order Details</span>
                        </NavLink>
                    </li>
                    <li class="nav-item">
                        <NavLink class="nav-link " to="/Userdetail">
                            <i class="bi bi-grid"></i>
                            <span class="span">User Details</span>
                        </NavLink>
                    </li>

                </ul>

            </aside>
        </>
    )
}

export default Sidebar
