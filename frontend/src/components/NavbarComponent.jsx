import React from 'react'
import { Link } from 'react-router-dom';

function NavbarComponent() {
    return (
        <div>
            <ul className="nav-ul justify-content-center bg-dark">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/add">Add Product</Link></li>
                <li><Link to="/update">Update Product</Link></li>
                <li><Link to="/logout">Logout</Link></li>
                <li><Link to="/profiles">Profiles</Link></li>
            </ul>
        </div>

    )
}

export default NavbarComponent;