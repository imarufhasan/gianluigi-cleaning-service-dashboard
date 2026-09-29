import { useRef, useState } from 'react';
import { Button, Input } from 'antd';
import JoditEditor from 'jodit-react';
import { useEditKnowledgeMutation } from '../../redux/feature/knowledgeHub/knowledgeApi';
import toast from 'react-hot-toast';

const EditModal = ({ refetch, setIsEditModalOpen, selectedEditCard }) => {

  const [editKnowledge] = useEditKnowledgeMutation(); // Hook for the mutation
  const editor = useRef(null);
  const [content, setContent] = useState(selectedEditCard?.description || ""); // Initialize with selected card's description
  const [title, setTitle] = useState(selectedEditCard?.title || ""); // Initialize with selected card's title

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 600,
    iframe: false,
  };

  // Handle the update of the knowledge hub item
  const handleSave = async () => {
    if (!title || !content) {
      alert("Title and Content are required.");
      return;
    }

    const data = { title, description: content };

    try {
       
      const response = await editKnowledge({ data, id: selectedEditCard._id }).unwrap();
      if (response?.success) {
        refetch(); // Refetch the data to update the list after editing
        setIsEditModalOpen(false); // Close the edit modal
        toast.success("Knowledge Hub updated successfully!");
      } else {
        toast.error("Failed to update. Please try again.");
      }
    } catch (error) {
      console.error("Error updating knowledge hub:", error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-6">Edit Knowledge</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)} // Update title state
        className="h-12 mb-6"
        placeholder="Enter the title"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <div className="mb-3">
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)} // Update content state on blur
          onChange={() => {}}
        />
      </div>

      <Button
        type="primary"
        block
        onClick={handleSave} // Trigger the save function to update
        className="h-12 bg-blue-900 text-white hover:bg-blue-800"
      >
        Update
      </Button>
    </div>
  );
};

export default EditModal;
