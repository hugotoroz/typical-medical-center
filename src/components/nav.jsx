import React, { useState, useEffect } from 'react';
import { GiMedicalDrip } from "react-icons/gi";
import "../css/navbar.css"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


  

const PrincipalNavbar = () => {

    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setIsNavbarVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
    };


    return (
        <>
        <Navbar collapseOnSelect expand="lg" className={isNavbarVisible ? 'navbar show-navbar' : 'navbar hide-navbar'} fixed="top" >
        <Container fluid>
            <Navbar.Brand href="#home"><GiMedicalDrip  style={{ fontSize: '1.9em' }}/></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">About us</Nav.Link>
                <Nav.Link href="#record">Record</Nav.Link>
                <Nav.Link href="#doctors">Doctors</Nav.Link>
                <NavDropdown title="Services" id="collapsible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Juan</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                    Gana
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Goty</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                    Toty
                </NavDropdown.Item>
                </NavDropdown>
            </Nav>
            <Nav>
                <Nav.Link href="#deets"  style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Typical Medical Center</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        </>
    );
  }

export default PrincipalNavbar;