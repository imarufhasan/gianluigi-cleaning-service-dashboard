import { useState } from "react";
import { Tabs, Input, Button, Avatar, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  useChangePassMutation,
  useEditProfileMutation,
  useMyDataQuery,
} from "../../redux/feature/userManagement/userManagementApi";

import { logout } from "../../redux/feature/auth/authSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {

  const { data: myData, refetch } = useMyDataQuery();
  const [activeTab, setActiveTab] = useState("1");
  const [editProfile] = useEditProfileMutation();
  const [changePass] = useChangePassMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form for Edit Profile
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      userName: myData?.data?.userName || "",
      profilePicture: null,
    },
  });

  // Form for Change Password
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  // Handle Profile Submit (for updating user profile)
  const onProfileSubmit = async (data) => {
    const formData = new FormData();
    formData.append("userName", data.userName);

    if (data.profilePicture && data.profilePicture[0]) {
      formData.append("profilePicture", data.profilePicture[0]);
    }

    try {
      const response = await editProfile({ data: formData }).unwrap();
      toast.success("Profile updated successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      toast.error(error?.data?.message || error.message);
    }
  };

  // Handle Password Submit (for changing user password)
  const onPasswordSubmit = async (data) => {
    try {
      const response = await changePass(data).unwrap();
      toast.success("Password changed successfully!");
      dispatch(logout());
      navigate("/sign-in");
      reset();
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
      toast.error(error?.data?.message);
    }
  };

  // Tab items for Profile and Password Update
  const tabItems = [
    {
      key: "1",
      label: "Edit Profile",
      children: (
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Edit Your Profile
          </h2>

          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Name
              </label>
              <Controller
                name="userName"
                control={profileControl}
                rules={{ required: "User name is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    className="rounded-lg border-gray-300"
                    status={profileErrors.userName ? "error" : ""}
                  />
                )}
              />
              {profileErrors.userName && (
                <p className="text-red-500 text-sm mt-1">
                  {profileErrors.userName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
             <Controller
  name="profilePicture"
  control={profileControl}
  render={({ field }) => (
    <input
      type="file"
      accept="image/*"
      className="w-full p-2 border rounded-lg"
      onChange={(e) => field.onChange(e.target.files)} // Properly capture the file selection
    />
  )}
/>

            </div>

            <button
              htmlType="submit"
              size="large"
              className="w-full bg-slate-700 hover:bg-slate-800 border-slate-700 text-white rounded-lg h-12 text-base font-medium"
            >
              Save & Change
            </button>
          </form>
        </div>
      ),
    },
    {
      key: "2",
      label: "Change Password",
      children: (
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Change Password
          </h2>

          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <Controller
                name="oldPassword"
                control={passwordControl}
                rules={{ required: "Current password is required" }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="••••••••••"
                    className="rounded-lg border-gray-300"
                    status={passwordErrors.oldPassword ? "error" : ""}
                  />
                )}
              />
              {passwordErrors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.oldPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <Controller
                name="newPassword"
                control={passwordControl}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="••••••••••"
                    className="rounded-lg border-gray-300"
                    status={passwordErrors.newPassword ? "error" : ""}
                  />
                )}
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <Controller
                name="confirmPassword"
                control={passwordControl}
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="••••••••••"
                    className="rounded-lg border-gray-300"
                    status={passwordErrors.confirmPassword ? "error" : ""}
                  />
                )}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              htmlType="submit"
              size="large"
              className="w-full bg-slate-700 hover:bg-slate-800 border-slate-700 text-white rounded-lg h-12 text-base font-medium"
            >
              Save & Change
            </button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-slate-700 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Avatar
                size={80}
                src={myData?.data?.profilePicture || "/assets/user.png"}
                className="border-4 border-white"
              />
            </div>
            <div className="ml-6 text-white">
              <h1 className="text-3xl font-bold">{myData?.data?.userName}</h1>
              <p className="text-slate-300 text-lg">
                {myData?.data?.role || "Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="rounded-2xl">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            size="large"
            className="profile-tabs"
            items={tabItems}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
