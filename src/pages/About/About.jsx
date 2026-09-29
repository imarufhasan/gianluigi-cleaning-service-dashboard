import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import { useCreateAndUpdateAboutMutation, useGetAboutQuery } from "../../redux/feature/others/othersApi";
import toast from "react-hot-toast"; // Importing toast for notifications

const About = () => {
  const [createAbout] = useCreateAndUpdateAboutMutation();
  const { data: about, refetch, isLoading, isError, error } = useGetAboutQuery(undefined); // Fetch About Us from the API

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 600,
    iframe: false,
  };
  // On component mount, load the content from the database if available, 
  // otherwise from localStorage
  useEffect(() => {
    if (about?.data?.text) {
      setContent(about.data.text); // Load from API response (from the database)
    } else {
      const savedContent = localStorage.getItem("termsContent"); // Fallback to localStorage if no data in the database
      if (savedContent) {
        setContent(savedContent);
      }
    }
  }, [about]); // Re-run when `about` data is updated from API

  // Function to handle saving the content to localStorage and API
  const handleSave = async () => {
    // Save content to localStorage
    localStorage.setItem("termsContent", content);

    try {
      // Attempt to save the content through API mutation
      const response = await createAbout({ text: content }).unwrap();
      toast.success("About Us content updated successfully!");
      refetch(); // Optionally refetch the data to update UI with latest content
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update About Us content.");
      console.error(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <div className="flex justify-between font-title bg-[#2C3E50] px-3 py-2 rounded-md">
        <div className="flex justify-center items-center gap-5">
          <p className="text-[#ffffff] font-title text-3xl font-bold">About Us</p>
        </div>
      </div>
      <div className="container min-h-screen mt-16">
        <div className="mt-5 text-black">
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)} // Update content on blur
            onChange={() => {}} // On change handler (no action needed)
          />
          <div className="text-center w-full">
            <button
              className="bg-[#1B2D51] p-2 text-white mt-2 rounded-lg w-[30%]"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
