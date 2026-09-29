

import { useForm } from "react-hook-form"
import { useState } from "react"

import { useNavigate } from "react-router-dom"
import { useSendOtpMutation } from "../../redux/feature/auth/authApi"
import { message } from "antd"
import toast from "react-hot-toast"




export default function ForgotPass() {
const [sendOtp] =useSendOtpMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
const navigate = useNavigate();
  const onSubmit = async(data) => {
    console.log('Form Data:', data);
    const email = data?.email
localStorage.setItem("Admin_Email",email)
       try {
      const res = await sendOtp(data).unwrap()

      console.log("response------->",res);
 
      if(res?.success){
        toast.success(res?.message)
 
        navigate('/verify')
      }else{
        toast.error(res?.message)
   
      }
    } catch (error) {
      console.log("login error",error)
         toast.error(error?.data?.message)

    }

    // Handle reset code sending logic here
  };


  return (
<div className="flex justify-center items-center min-h-screen">
        <div className="w-[30%]  bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Forgot Password?</h1>
  
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="enter your gmail"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>



      

        <button
          type="submit"
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
       Send Code
        </button>
      </form>
    </div>
</div>
  )
}
