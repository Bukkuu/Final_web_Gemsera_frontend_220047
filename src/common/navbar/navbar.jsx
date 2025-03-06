import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);

  // Check token on initial load and when it changes
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          setUser(decodedUser);
        } catch (error) {
          console.error("Invalid token", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for localStorage changes (like login/logout)
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-glass">
      <div className="container-fluid">
        <img
          src="gemlogo.jpg"
          alt="home"
          width="70px"
          className="navbar-logo"
        />

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/top-rated">
                Top Rated
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart
              </Link>
            </li>

            {/* Show "All Products" and "Edit Products" for admin */}
            {user && user.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/adminAddProduct">
                    Add Product
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/editProduct">
                    Edit Products
                  </Link>
                </li>
              </>
            )}
          </ul>

          <form className="d-flex">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle user-dropdown"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  Welcome, {user.name || "User"}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn btn-outline-dark btn-highlight me-2"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-dark btn-highlight"
                >
                  Login
                </Link>
              </>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
