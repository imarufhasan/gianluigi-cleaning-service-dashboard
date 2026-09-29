import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import { useCreateAndUpdateTermsMutation, useGetTermsQuery } from "../../redux/feature/others/othersApi";
import toast from "react-hot-toast"; // Importing toast for notifications

const Terms = () => {
  const [createTerms] = useCreateAndUpdateTermsMutation();
  const { data: terms,refetch} = useGetTermsQuery(undefined); // Fetch terms from the API
console.log("terms---->",terms?.data?.text);
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 600,
    iframe: false,
  };

  // On component mount, load the content from the server (or localStorage if no data is available)
  useEffect(() => {
    if (terms?.data?.text) {
      setContent(terms.data.text);
    } else {
      const savedContent = localStorage.getItem("termsContent");
      if (savedContent) {
        setContent(savedContent);
      }
    }
  }, [terms]);

  // Function to handle saving the content to both localStorage and the server
  const handleSave = async () => {
    // Save content to localStorage
    localStorage.setItem("termsContent", content);

    try {
      // Attempt to save the content to the server via the API
      const response = await createTerms({ text: content }).unwrap();
      toast.success("Terms & Conditions updated successfully!");
      refetch()
    } catch (error) {
      toast.error(error?.data?.message);
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between font-title bg-[#2C3E50] px-3 py-2 rounded-md">
        <div className="flex justify-center items-center gap-5">
          <p className="text-[#ffffff] font-title text-3xl font-bold">Terms & Conditions</p>
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
            onChange={() => {}} // No action needed for onChange in this case
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

export default Terms;
