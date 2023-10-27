import React from "react";
import logo from '../Forma 1.png';

function Home() {
    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Home Page</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <img src={logo} className="Logo-As" alt="logo" />
                </div>
            </main>
        </div>
        );
}

export default Home;