import Alert from "../components/Alert";
import { GlobalContext } from "../context/AppContext";
import { useContext } from "react";
import Teacher from "../components/Teacher";
import Student from "../components/Student";
import Admin from "../components/Admin";
const Home = () => {
  const { theme, user } = useContext(GlobalContext);
  let renderContent;
  switch (user?.role) {
    case "admin":
      renderContent = <Admin />;
      break;
    case "teacher":
      renderContent = <Teacher />;
      break;
    case "student":
      renderContent = <Student />;
      break;
    default:
      renderContent = <div>Please verify yourself from our admin</div>;
  }
  // if (user?.role === "admin") {
  //   renderContent = <Admin />;
  // } else if (user?.role === "teacher") {
  //   renderContent = <Teacher />;
  // } else if (user?.role === "student") {
  //   renderContent = <Student />;
  // }
  return (
    <div className="min-h-screen px-2 py-20">
      <Alert />
      {/* <div className="flex flex-nowrap overflow-x-scroll gap-2 w-full justify-center fixed h-full" style={{"scrollbarWidth": "none"}} >
      <p className="badge  p-4 badge-accent">All</p>
      <p className="badge badge-ghost p-4">default</p>
      </div> */}
      <div className="text-center">{renderContent}</div>
    </div>
  );
};

export default Home;
