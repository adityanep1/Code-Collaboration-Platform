import { useState } from "react";
import Input from "../components/Input";
import api from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle register button click
  const handleSubmit = async () => {
    try {
      const response = await api.post("/auth/register", formData);

      console.log(response.data);

      alert("✅ Registration Successful!");

      // Clear the form
      setFormData({
        name: "",
        email: "",
        password: "",
      });

    } catch (error) {
      console.log(error.response?.data);

      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  console.log(formData);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-[400px] p-8 border rounded-xl">

        <h1 className="text-3xl font-bold mb-6">
          Register
        </h1>

        <div className="space-y-4">

          <Input
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
          />

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
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Register
          </button>

        </div>

      </div>
    </div>
  );
};

export default Register;