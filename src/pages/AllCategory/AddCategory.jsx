import { useForm } from "react-hook-form";
import { useCreateCategoryMutation } from "../../redux/feature/others/othersApi";
import toast from "react-hot-toast";

const AddCategory = ({ refetch,setModalOpen }) => {
  const [createCat] = useCreateCategoryMutation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Create FormData object to send the data
    const formData = new FormData();
    formData.append("name", data.name);  // Make sure 'name' field is sent correctly
    formData.append("image", data.image[0]);  // Handle file input correctly (ensure it's an array)

    // Log FormData content for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);  // This will log 'name' and the file data
    }

    try {
      // Sending the form data to the API
      const res = await createCat(formData).unwrap();
      console.log("API Response:", res);  // Check the response in the console

      if (res?.success) {
        toast.success(res?.message);  // Show success notification
        setModalOpen(false)
         reset()
        refetch();  // Refetch categories to update the UI
      } else {
        toast.error(res?.message);  // Show error if response is unsuccessful
      }
    } catch (error) {
      console.log("API Error:", error);  // Log any errors that occur
      toast.error(error?.data?.message);  // Show error message from API
    }
  };
const handleCloseModal=()=>{
    setModalOpen(false)
}
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 rounded-lg border">
        {/* Category Name */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            {...register("name", { required: "Category name is required" })}  // Register 'name' field with validation
            className="w-full p-2 text-sm border-none focus:outline-none bg-gray-100"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}  {/* Display validation error */}
        </div>

        {/* Image Upload */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            {...register("image", { required: "Image is required" })}  // Register 'image' field with validation
            accept="image/*"
            className="w-full p-2 mt-2 text-sm border border-gray-300 rounded-md"
          />
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}  {/* Display validation error */}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex w-full space-x-4">
          <button
            type="button"
            onClick={() => handleCloseModal()}
            className="text-gray-600 hover:text-gray-800 font-semibold w-1/2 border rounded-md border-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 w-1/2"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
