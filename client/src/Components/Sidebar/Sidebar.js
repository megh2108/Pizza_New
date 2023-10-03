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


                </ul>

            </aside>
        </>
    )
}

export default Sidebar
