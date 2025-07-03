import React, { useState } from 'react'
import authService from '../appwrite/auth.js'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const dispatch = useDispatch()
    const {register,handleSubmit}=useForm()
    
    const create = async (data) => {
      console.log("🧪 Form submitted with data:", data); // Add this line
      setError("");
      try {
        const userData = await authService.createAccount(data);
        console.log("✅ Account created:", userData);

        if (userData) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            dispatch(login(currentUser));
            navigate("/");
          }
        }
      } catch (error) {
        setError(error.message);
        console.error("❌ Signup error:", error.message);
      }
    };
       
  return (
    <div className="flex items-center jsutify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold">
          Sign up to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have account?
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover-underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="Full Name:"
              placeholder="Enetr you rfull name"
              {...register("name", {
                required: true,
              })}
            />
            <Input
              label="Email:"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />

            <Input
              label="password:"
              type="password"
              placeholder="ENter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup
