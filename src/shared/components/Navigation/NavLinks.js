import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

function NavLinks(props) {
    const { isLoggedIn, userId, logout } = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact>
                    All Users
                </NavLink>
            </li>
            {isLoggedIn && (
                <li>
                    <NavLink to={`/${userId}/places`}>My Places</NavLink>
                </li>
            )}
            {isLoggedIn && (
                <li>
                    <NavLink to="/places/new">Add Place</NavLink>
                </li>
            )}
            {!isLoggedIn && (
                <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                </li>
            )}
            {isLoggedIn && (
                <li>
                    <button onClick={logout}>Log out</button>
                </li>
            )}
        </ul>
    );
}

export default NavLinks;
