import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import UserService from "../../api/UserService";
import { useAuthStore } from "../../store.tsx";
import { PersonCircle } from "react-bootstrap-icons";
import { BellFill } from "react-bootstrap-icons";

export default function CustomNavbar(props) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [width, setWidth] = useState(window.innerWidth);
  const logout = async () => {
    try {
      if (await UserService.logout()) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <Navbar className="top-nav primary" style={{ paddingInline: '1rem' }}>
      {
        width <= 700 ?
          <Nav.Link>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-list" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
            </svg>
          </Nav.Link> : <Nav></Nav>
      }
      <div className="d-flex gap-4 align-items-center">
        <Nav onClick={() => props.openNotificationModal()}>
          <BellFill style={{ fontSize: '20px', color: '#111a45' }} />
        </Nav>
        <Nav.Link>
          <PersonCircle style={{ fontSize: '20px', color: '#111a45' }} />
        </Nav.Link>
        <button onClick={logout}>Logout</button>
      </div >
    </Navbar>
  );
}
