import React, { useState } from "react";
import { Modal, Button, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAllCategoryQuery, useDeleteCategoryMutation } from "../../redux/feature/others/othersApi";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory"; 

const AllCategory = () => {
    const [deleteCategory] = useDeleteCategoryMutation();
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Queries & Mutations
  const { data: allCategory, refetch } = useAllCategoryQuery({ limit, page });


  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      message.success("Category deleted successfully");
      refetch();
    } catch (err) {
      message.error(err?.data?.message || "Failed to delete");
    }
  };

  // Open Edit Modal
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#0F0B18]">All Category</h2>
        <Button
          type="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-900"
        >
          Add Category
        </Button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {allCategory?.data?.map((cat) => (
          <div key={cat?._id} className="relative group rounded-xl overflow-hidden shadow bg-white border">
            {/* Actions overlay */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="small" 
                icon={<EditOutlined />} 
                onClick={() => handleEditClick(cat)} 
              />
              <Popconfirm
                title="Delete this category?"
                onConfirm={() => handleDelete(cat?._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>

            <img src={cat?.image} alt={cat?.name} className="w-full h-32 object-cover" />
            <div className="p-3 text-center font-medium text-black">{cat?.name}</div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      <Modal
        title="Add Category"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <AddCategory setModalOpen={setIsAddModalOpen} refetch={refetch} />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedCategory(null);
        }}
        footer={null}
        destroyOnClose
      >
        {selectedCategory && (
          <EditCategory 
            categoryData={selectedCategory} 
            setIsEditModalOpen={setIsEditModalOpen} 
            refetch={refetch} 
          />
        )}
      </Modal>
    </div>
  );
};

export default AllCategory;