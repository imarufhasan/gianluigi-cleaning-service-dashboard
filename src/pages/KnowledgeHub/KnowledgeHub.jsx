import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { FiFileText, FiEdit, FiTrash2, FiBox } from 'react-icons/fi';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import { LuBookText } from 'react-icons/lu';
import { useDeleteKnowledgeMutation, useGetAllKnowledgeQuery } from '../../redux/feature/knowledgeHub/knowledgeApi';
import toast from 'react-hot-toast';

const KnowledgeHub = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); // To store the card to be deleted
  const [selectedEditCard, setSelectedEditCard] = useState(null); // To store the card to be deleted
  const [deleteKnowledge] = useDeleteKnowledgeMutation();
  const { data: allKnowledge, refetch } = useGetAllKnowledgeQuery(undefined);
  console.log("all knowledge data----->", allKnowledge);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const openEditModal = (card) => {
    setIsEditModalOpen(true);
     setSelectedEditCard(card);
  };

  const openDeleteModal = (card) => {
    setSelectedCard(card); // Store the selected card to be deleted
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedCard) {
      const id =selectedCard?._id
      console.log("selected card id--->",id);
      try {
        // Delete the selected card
        await deleteKnowledge(id).unwrap(); // Assuming the API expects { id }
        refetch(); // Refetch the data after deletion
        setIsDeleteModalOpen(false); // Close the modal
        toast.success("Knowledge Hub item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error(error?.data?.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
        <button
          onClick={openCreateModal}
          className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
        >
          Create New
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allKnowledge?.data?.map((card) => (
          <div
            key={card._id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <div className="text-blue-500"> <LuBookText className="w-6 h-6" /></div>
            </div>

            <h3 className="text-base font-semibold text-blue-600 mb-2">
              {card.title}
            </h3>

            {/* Render description with HTML content */}
            <p
              className="text-sm text-gray-600 mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: card.description }} // Use dangerouslySetInnerHTML to render HTML
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => openEditModal(card)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiEdit className="w-4 h-4" />
              </button>

              <button
                onClick={() => openDeleteModal(card)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <Modal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={1000}
        centered
      >
        <CreateModal refetch={refetch} setIsCreateModalOpen={setIsCreateModalOpen} />
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={1000}
        centered
      >
        <EditModal refetch={refetch} setIsEditModalOpen={setIsEditModalOpen} selectedEditCard={selectedEditCard}/>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        width={400}
        centered
      >
        <h2 className="text-xl font-semibold text-center mb-6">
          Are you sure you want to delete?
        </h2>

        <Button
          block
          className="h-12 bg-[#0D1A3A] text-white text-base font-medium rounded-lg hover:bg-[#0b1530]"
          onClick={handleDelete} // Call handleDelete to delete the item
        >
          Yes
        </Button>

        <Button
          block
          className="h-12 mt-3 border border-gray-300 text-base font-medium rounded-lg"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          No
        </Button>
      </Modal>
    </div>
  );
};

export default KnowledgeHub;
