import Signup from "./components/Signup";
import LandingPage from "./components/LandingPage";
import Cart from "./components/Cart.js";
import Showdescription from "./components/Showdescription.js";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/privateRoute.js";
import Signin from "./components/Signin.js";
import Confirmation from "./components/confirm.js";
import VerifyToken from "./components/VerifyToken.js";
import Resetpassword from "./components/Reset-password.js";
function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/products/:id" element={<Showdescription />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="verify-token" element={<VerifyToken />} />
        <Route path="reset-password" element={<Resetpassword/>}/>
      </Routes>
    </>
  );
}

export default App;
