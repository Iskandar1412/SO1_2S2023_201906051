//import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar';
import Home from './pages/Home';
import About from './pages/About';
import RealTime from './pages/RealTime';
import LongTime from './pages/LongTime';
import 'https://use.fontawesome.com/releases/v6.1.0/js/all.js';
import 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
import logico from './Log.png'


function App() {
  let component 
    switch (window.location.pathname) {
      case "/":
        component = <Home />
        break;
      case "/About":
        component = <About />
        break;
      case "/RealTime":
        component = <RealTime />
        break;
      case "/LongTime":
        component = <LongTime />
        break;
      default:
        break;
    }


  return (
    <>
    <nav className='sb-topnav navbar navbar-expand navbar-dark bg-dark'>
      <img src={logico} className="Logo-Asv2" alt="logo" />
      <a className='navbar-brand ps-2' href="/">Proyecto 2</a>
      <button className='btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0' id='sidebarToggle'
        onClick={() => {
          document.body.classList.toggle('sb-sidenav-toggled');
          localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        }}
      ><i className='fas fa-bars'></i></button>
      
      
    </nav>
    <div id='layoutSidenav'>
      <Navbar />
      {component}
    </div>
    </>
  );
}

export default App;

/*Button (sidebarToggle)

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

*/