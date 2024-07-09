import { Outlet } from "react-router-dom";
import NavbarFunc from "../components/Navbar";
import FooterFunc from "../components/Footer";
import { GlobalContext } from "../context/AppContext";
import { useContext } from "react";
const MainLayout = () => {
  const {theme} = useContext(GlobalContext);
  return (
    <div data-theme={`${theme}`}>
        <NavbarFunc />
        <Outlet />
        <FooterFunc />
    </div>
  );
};

export default MainLayout;
