import { ChatState } from "../utils/ChatProvider";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Home() {
  const { user, setUser } = ChatState();
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  function handleLogin() {
    if(!email) return;
    const newUser = {
      _id: uuidv4(),
      email: email,
    };
    setUser(newUser);
    localStorage.setItem("userCredentials", JSON.stringify(newUser));
    toast("User created successfully!")
    navigate("/chatboard");
  }
  if (user) {
    return <Navigate to="/chatboard" replace />;
  }

  return (
    <div className="flex flex-col">
      <h3 className="pb-6 text-xl font-semibold">Welcome to Chat App</h3>

      <form className="flex flex-col items-center">
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="userEmail">Enter Your Email</label>
          <input
            className="p-2 text-black w-72"
            id="userEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="button" disabled={!email}  onClick={handleLogin} className="primary">
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
