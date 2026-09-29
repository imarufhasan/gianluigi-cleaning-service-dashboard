

import { useForm } from "react-hook-form"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useLoginMutation } from "../../redux/feature/auth/authApi"
import { verifyToken } from "../../utils/verifyToken"
import { setUser } from "../../redux/feature/auth/authSlice"
import toast from "react-hot-toast"




export default function Login() {
    const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch()
const [login]=useLoginMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async(data) => {
    // console.log('Form Data:', data);
    // Handle sign-in logic here
    
    try {
         const res = await login(data).unwrap()
        //  console.log("response------->",res);
         if(res?.success){
        const user = verifyToken(res.data.token);
        // console.log("inside success",res);
        toast.success(res?.message)
  
        dispatch(setUser({user: user, token: res.data.token }))

        navigate('/')
      }else{
                // console.log("inside error",res);
        toast.error(res?.error?.data?.message)

      }
    } catch (error) {
      // console.log("login error",error)
         toast.error(error?.data?.message)

    }
  }


  return (
<div className="flex justify-center items-center min-h-screen">
        <div className="w-[30%]  bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Log in to your account</h1>
        <p className="text-gray-600 text-sm">Please enter your email and password to continue</p>
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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              {...register("rememberPassword")}
            />
            <span className="ml-2 text-sm text-gray-700">Remember Password</span>
          </label>
          <Link to={'/forgotPass'}>
          <button type="button" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            Forgot Password?
          </button>
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Sign in
        </button>
      </form>
    </div>
</div>
  )
}
