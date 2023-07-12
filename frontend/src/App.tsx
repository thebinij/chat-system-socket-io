import "./App.css";
import { Routes, Route } from "react-router-dom";
import ChatBoard from "./pages/ChatBoard";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "./utils/ChatProvider";
import ProtectedRoute from "./components/PrivateRoutes";
import { useEffect } from "react";

function App() {
  const { user, setUser } = ChatState();

  useEffect(() => {
    // Check whether user credential already
    const credentials = localStorage.getItem("userCredentials");
    if (credentials) {
      // Set Logged in User
      setUser(JSON.parse(credentials));
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/chatboard"
          element={
            <ProtectedRoute user={user}>
              <ChatBoard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </>
  );
}

export default App;
