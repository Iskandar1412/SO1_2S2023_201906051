import React from "react";

function Navbar() {
    return (
        <div id = 'layoutSidenav_nav'>
            <nav className='sb-sidenav accordion sb-sidenav-dark' id="sidenavAccordion">
                <div className='sb-sidenav-menu'>
                    <div className='nav'>
                        <div className='sb-sidenav-menu-heading'>Core</div>
                        <a className='nav-link' href="/">
                            <div className='sb-nav-link-icon'><i className="fas fa-tachometer-alt"></i></div>
                            Dashboard
                        </a>
                        <div className='sb-sidenav-menu-heading'>Interface</div>
                        <a className='nav-link collapsed' href='/' data-bs-toggle='collapse' data-bs-target='#collapseLayouts' aria-expanded='false' aria-controls='collapseLayouts'>
                            <div className='sb-nav-link-icon'><i className="fas fa-columns"></i></div>
                            Pages
                            <div className='sb-sidenav-collapse-arrow'><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className='collapse' id='collapseLayouts' aria-labelledby='headingOne' data-bs-parent='#sidenavAccordion'>
                            <nav className='sb-sidenav-menu-nested nav'>
                                <a className='nav-link' href='/Other'>Artista</a>
                                <a className='nav-link' href="/RealTime">Real Time</a>
                                <a className='nav-link' href="/LongTime">Long Time</a>
                                <a className='nav-link' href="/About">About</a>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className='sb-sidenav-footer'>
                    <div className="small">Created by:</div>
                    Iskandar
                </div>
            </nav>
        </div>
    );
}

export default Navbar;

