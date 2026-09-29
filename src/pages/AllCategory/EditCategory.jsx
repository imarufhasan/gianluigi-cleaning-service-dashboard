import React, { useState, useEffect } from "react";
import { Input, Button, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEditCategoryMutation } from "../../redux/feature/others/othersApi";

const EditCategory = ({ categoryData, setIsEditModalOpen, refetch }) => {
  const [name, setName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [editCategory, { isLoading }] = useEditCategoryMutation();


  useEffect(() => {
    if (categoryData) {
      setName(categoryData.name);
      setFileList([
        {
          uid: "-1",
          name: "current_image.png",
          status: "done",
          url: categoryData.image,
        },
      ]);
    }
  }, [categoryData]);

  const handleUpdate = async () => {
    if (!name) return message.error("Name is required");

    const formData = new FormData();
    formData.append("name", name);
    
    if (fileList[0]?.originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    try {
 
      await editCategory({ id: categoryData._id, data: formData }).unwrap();
      
      message.success("Category updated successfully!");
      refetch(); 
      setIsEditModalOpen(false); 
    } catch (err) {
      message.error(err?.data?.message || "Failed to update category");
    }
  };

  return (
    <div className="space-y-5 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="h-10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category Image</label>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false}
          maxCount={1}
        >
          {fileList.length < 1 && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </div>

      <Button
        type="primary"
        block
        onClick={handleUpdate}
        loading={isLoading}
        className="h-10 bg-blue-900"
      >
        Update Category
      </Button>
    </div>
  );
};

export default EditCategory;