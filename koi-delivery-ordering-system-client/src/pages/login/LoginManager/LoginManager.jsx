import { useState } from "react";
import "./LoginManager.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../authentication/AuthProvider";
import { userLogin } from "../../../utils/axios/customer";
import ToastUtil from "../../../components/toastContainer";
import { toast } from "react-toastify";

function LoginManager() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleGoBack = () => {
    navigate("/login-customer");
  };

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleLogin(roleId) {
    try {
      const data = await userLogin(email, password, roleId);
      if (data) {
        auth.handleLogin(data);
        navigate("/admin/dashboard");
        toast("Login successfully");
      } else {
        toast("Wrong email or password");
      }
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <div className="login-admin-container">
      <ToastUtil />
      <div className="card">
        <h3 className="text-center">
          <strong>Manager Login</strong>
        </h3>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Type your email"
            onChange={(e) => handleEmailChange(e)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => handlePasswordChange(e)}
            placeholder="Type your password"
          />
        </div>

        <div className="btn">
          <button type="submit" onClick={() => handleLogin(4)}>
            Login
          </button>
        </div>

        <button className="back-button" onClick={() => handleGoBack()}>
          &#8592; Back to customer login
        </button>
      </div>
    </div>
  );
}
export default LoginManager;
