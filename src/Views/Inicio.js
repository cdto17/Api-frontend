// src/Inicio.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
    return (
        <div className="container">
            <div className="content">
                <h1>CONSUMO DE API's</h1>
                <h2>Api-Rest    /   GraphQL</h2>
                
                <div className="button-container">
                    <Link to="/button1"><button className="styled-button">RESTful</button></Link>
                    <Link to="/button2"><button className="styled-button">GraphQL</button></Link>
                    <Link to="/button3"><button className="styled-button">gRPC</button></Link>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
