import { useState } from "react";
import { Modal, Button, Popconfirm, Skeleton, Empty, Pagination, ConfigProvider, message } from "antd";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  useAllCategoryQuery,
  useDeleteCategoryMutation,
} from "../../redux/feature/others/othersApi";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";

const LIMIT = 10;
const NAVY = "#1B2D51";
const TEAL = "#00c0b5";

const AllCategory = () => {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deletingId, setDeletingId] = useState("");

  const { data, isLoading, isFetching, refetch } = useAllCategoryQuery({ limit: LIMIT, page });
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = data?.data || [];
  // meta shape tomar backend onujayi; na thakle pagination hide thakbe
  const total = data?.meta?.total || 0;

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteCategory(id).unwrap();
      message.success("Category deleted");
      // Last item delete korle age-r page e fire jao
      if (categories.length === 1 && page > 1) setPage((p) => p - 1);
      else refetch();
    } catch (err) {
      message.error(err?.data?.message || "Could not delete the category. Try again.");
    } finally {
      setDeletingId("");
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const closeEdit = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl font-title">
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">All Category</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {isLoading
                ? "Loading categories..."
                : `${total || categories.length} ${
                    (total || categories.length) === 1 ? "category" : "categories"
                  }`}
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: NAVY }}
          >
            Add category
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-xl border border-gray-200 p-3">
                  <Skeleton.Image active className="!h-28 !w-full" />
                  <Skeleton active paragraph={false} className="mt-3" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Empty description="No categories yet. Add one to get started." className="py-12">
              <Button type="primary" onClick={() => setIsAddModalOpen(true)} style={{ backgroundColor: NAVY }}>
                Add category
              </Button>
            </Empty>
          ) : (
            <div
              className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${
                isFetching ? "opacity-70" : ""
              }`}
            >
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  {/* Actions: touch screen e shobshomoy visible, desktop e hover/focus e */}
                  <div className="absolute right-2 top-2 z-10 flex gap-1.5 transition-opacity lg:opacity-0 lg:focus-within:opacity-100 lg:group-hover:opacity-100">
                    <Button
                      size="small"
                      aria-label={`Edit ${cat.name}`}
                      icon={<Pencil className="h-3.5 w-3.5" />}
                      onClick={() => handleEditClick(cat)}
                    />
                    <Popconfirm
                      title="Delete this category?"
                      description="This can't be undone."
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDelete(cat._id)}
                    >
                      <Button
                        size="small"
                        danger
                        aria-label={`Delete ${cat.name}`}
                        loading={deletingId === cat._id}
                        icon={<Trash2 className="h-3.5 w-3.5" />}
                      />
                    </Popconfirm>
                  </div>

                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full bg-gray-100 object-cover"
                  />
                  <p className="truncate px-3 py-3 text-center font-medium text-gray-900" title={cat.name}>
                    {cat.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination (backend meta.total pathale) */}
        {total > LIMIT && (
          <div className="flex items-center justify-center border-t border-gray-100 py-4">
            <ConfigProvider theme={{ components: { Pagination: { colorPrimary: TEAL } } }}>
              <Pagination
                current={page}
                total={total}
                pageSize={LIMIT}
                onChange={setPage}
                showSizeChanger={false}
                size="small"
              />
            </ConfigProvider>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        title="Add category"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
      >
        <AddCategory setModalOpen={setIsAddModalOpen} refetch={refetch} />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit category"
        open={isEditModalOpen}
        onCancel={closeEdit}
        footer={null}
        centered
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