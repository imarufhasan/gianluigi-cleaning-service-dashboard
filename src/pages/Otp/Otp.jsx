"use client";

import { useForm, Controller } from "react-hook-form";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useSendOtpMutation, useVerifyOtpMutation } from "../../redux/feature/auth/authApi";
import toast from "react-hot-toast";


export default function Otp() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

const email = localStorage.getItem('Admin_Email')
console.log("Admin_Email--->",email);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
    },
  });

  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  // Handle OTP verification
  const onSubmit = async (data) => {
    const verifyCode =
      data.digit1 + data.digit2 + data.digit3 + data.digit4 + data.digit5 + data.digit6;

    const modifiedData = {
      email,
      otp: verifyCode,
    };

    try {
      const res = await verifyOtp(modifiedData).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        navigate("/setPass");
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email before requesting a resend.");
      return;
    }

    try {
      const res = await sendOtp({ email }).unwrap();
      if (res?.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // OTP input handlers
  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const fieldName = `digit${index + 1}`;
      setValue(fieldName, value);

      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !watch(`digit${index + 1}`) && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-[30%] bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Verification Code
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We sent a reset code to <b>{email || "your email"}</b>
            <br />
            Enter the 5-digit code from your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3, 4,5].map((index) => (
              <Controller
                key={index}
                name={`digit${index + 1}`}
                control={control}
                render={({ field }) => (
                  <input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={field.value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                )}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Verify Code
          </button>

          <div className="text-center">
            <span className="text-gray-600 text-sm">
              Didn’t receive the email?{" "}
            </span>
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-green-500 hover:text-green-600 font-medium text-sm"
            >
              Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
