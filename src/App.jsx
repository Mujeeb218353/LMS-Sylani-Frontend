import { Outlet } from "react-router-dom";
import useAuthRedirect from "./hooks/useAuthRedirect";

const App = () => {
  useAuthRedirect();
  return (
    <>
      <Outlet />
    </>
  );
};

export default App;
