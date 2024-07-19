import { Outlet } from "react-router-dom";
import NavbarFunc from "../components/Navbar";
import FooterFunc from "../components/Footer";
import { GlobalContext } from "../context/AppContext";
import { useContext } from "react";
import Alert from "../components/Alert";
const MainLayout = () => {
  const { theme } = useContext(GlobalContext);
  return (
    <div data-theme={theme}>
      <Alert />
      <NavbarFunc />
      <Outlet />
      <FooterFunc />
    </div>
  );
};

export default MainLayout;
