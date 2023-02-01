import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import routes, { renderRoutes } from "./routes";
import { fetchUser } from "./slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  // useEffect(() => {
  //   if(user){
  //   dispatch(fetchUser())
  //   }

  // }, [user]);

  return (
    <div className="App">
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      <ToastContainer
        theme="colored"
        // autoClose={5000}
        // hideProgressBar={false}
        // newestOnTop={false}
        // closeOnClick
        // rtl={false}
        // pauseOnFocusLoss
        draggable
        // pauseOnHover
      />
    </div>
  );
}

export default App;
