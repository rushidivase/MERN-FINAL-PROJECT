import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

function NavbarComponent() {

    const auth = localStorage.getItem('user');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/signup');
    }

    return (
        <div>
            {auth ? <ul className="nav-ul justify-content-center bg-dark">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/add">Add Product</Link></li>
                <li><Link to="/profiles">Profiles</Link></li>
                <li>
                    {auth ? <Link onClick={handleLogout}
                        to="/signup">Logout ({JSON.parse(auth).name})</Link> : <Link to="/signup">Sign Up</Link>}
                </li>
            </ul>
                :
                <ul className="nav-ul justify-content-end bg-dark">
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            }
        </div>

    )
}

export default NavbarComponent;