import { useState } from "react";
import Input from "../components/Input";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/auth/login", formData);

      console.log(response.data);

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      alert("Login Successful!");

      navigate("/dashboard");

    } catch (error) {
      console.log(error.response?.data);

      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-[400px] p-8 border rounded-xl">

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <div className="space-y-4">

          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white p-3 rounded-lg"
          >
            Login
          </button>

        </div>

      </div>
    </div>
  );
};

export default Login;