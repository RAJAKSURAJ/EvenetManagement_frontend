import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Event Management</Link>
                <div className="navbar-nav">
                    <Link className="nav-link" to="/events">Events</Link>
                    {localStorage.getItem('token') ? (
                        <button className="btn btn-danger" onClick={() => { localStorage.clear(); window.location.href = '/' }}>Logout</button>
                    ) : (
                        <Link className="nav-link" to="/">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
