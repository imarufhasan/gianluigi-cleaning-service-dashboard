import { Button, Input } from 'antd';
import JoditEditor from 'jodit-react';
import { useRef, useState } from 'react';
import { useCreateKnowledgeMutation } from '../../redux/feature/knowledgeHub/knowledgeApi';
import toast from 'react-hot-toast';

const CreateModal = ({ refetch, setIsCreateModalOpen }) => {
  const [createKnowledge] = useCreateKnowledgeMutation();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 400, 
    iframe: false,
  };

  const handleSave = async () => {
    if (!title || !content || content === "<p><br></p>") { 
      toast.warning("Title and Content are required.");
      return;
    }

    const data = {
      title,
      description: content,
    };

    try {
      const response = await createKnowledge(data).unwrap();
      if (response?.success) {
        toast.success("Knowledge Hub created successfully!");
        
     
        setTitle("");
        setContent("");
        
        refetch();
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-6"> Create Knowledge Hub </h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <Input
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        className="h-12 mb-6"
        placeholder="Enter the title"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <div className='mb-3'>
        <JoditEditor
          ref={editor}
          value={content} 
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)} 
          onChange={() => {}}
        />
      </div>

      <Button
        type="primary"
        block
        onClick={handleSave}
        className="h-12 bg-blue-900 text-white hover:bg-blue-800"
      >
        Save
      </Button>
    </div>
  );
};

export default CreateModal;