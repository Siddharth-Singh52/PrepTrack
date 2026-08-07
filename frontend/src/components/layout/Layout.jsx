import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

    return (

        <div className="layout">

            <Sidebar />

            <div className="main-layout">

                <Navbar />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>

    );

}

export default Layout;