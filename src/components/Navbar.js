import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function Navbar({ user }) {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="nav-wrapper black">
        <div className="container">
          <Link to="/" className="brand-logo">
            TaskMaker
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {user ? (
              <>
                <li>
                  <button
                    className="btn red waves-effect waves-light"
                    onClick={() => {
                      auth.signOut();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn waves-effect waves-light">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="btn waves-effect waves-light">
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
