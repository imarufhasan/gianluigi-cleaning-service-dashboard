import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Image,
  Upload,
  Skeleton,
  Empty,
  message,
} from "antd";
import { Plus, Trash2, ImagePlus, X } from "lucide-react";

import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
} from "../../redux/feature/banner/bannerApi";

const MAX_SIZE_MB = 5;
const BRAND = "#1B2D51";
const ACCENT = "#00c0b5";

export default function Banner() {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners = data?.data || [];

  // ---------- Add modal state ----------
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Preview url for selected file (memory leak avoid korte revoke kora hoy)
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );
  useEffect(
    () => () => previewUrl && URL.revokeObjectURL(previewUrl),
    [previewUrl],
  );

  // ---------- Delete modal state ----------
  const [deleteTarget, setDeleteTarget] = useState(null);

  const resetAddForm = () => {
    setTitle("");
    setFile(null);
    setErrors({});
  };

  const closeAdd = () => {
    if (isCreating) return;
    setAddOpen(false);
    resetAddForm();
  };

  const handleSelectFile = (f) => {
    if (!f.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, image: "Only image files are allowed." }));
      return Upload.LIST_IGNORE;
    }
    if (f.size / 1024 / 1024 > MAX_SIZE_MB) {
      setErrors((e) => ({
        ...e,
        image: `Image must be smaller than ${MAX_SIZE_MB}MB.`,
      }));
      return Upload.LIST_IGNORE;
    }
    setFile(f);
    setErrors((e) => ({ ...e, image: undefined }));
    return false; // auto upload off
  };

  const handleCreate = async () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Enter a banner title.";
    if (!file) nextErrors.image = "Choose a banner image.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title.trim());

    try {
      await createBanner(formData).unwrap();
      message.success("Banner added");
      setAddOpen(false);
      resetAddForm();
      refetch();
    } catch (err) {
      message.error(
        err?.data?.message || "Could not add the banner. Try again.",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBanner(deleteTarget.id).unwrap();
      message.success("Banner deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      message.error(
        err?.data?.message || "Could not delete the banner. Try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Banners</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isLoading
                ? "Loading banners..."
                : `${banners.length} ${banners.length === 1 ? "banner" : "banners"} live in the app`}
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAddOpen(true)}
            style={{ backgroundColor: BRAND }}
          >
            Add banner
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-xl border border-gray-200 p-3">
                  <Skeleton.Image active className="!w-full !h-44" />
                  <Skeleton active paragraph={false} className="mt-3" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-16 text-center">
              <p className="text-gray-700 font-medium">
                We couldn't load the banners.
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Check your connection and try again.
              </p>
              <Button onClick={refetch}>Retry</Button>
            </div>
          ) : banners.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No banners yet. Add one to show it in the app."
              className="py-12"
            >
              <Button
                type="primary"
                onClick={() => setAddOpen(true)}
                style={{ backgroundColor: BRAND }}
              >
                Add banner
              </Button>
            </Empty>
          ) : (
            <div
              className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 transition-opacity ${
                isFetching ? "opacity-70" : ""
              }`}
            >
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="group rounded-xl border border-gray-200 bg-white overflow-hidden"
                >
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    wrapperClassName="!block w-full"
                    className="!w-full !h-44 object-cover"
                    preview={{ mask: "Preview" }}
                  />
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <p
                      className="font-medium text-gray-900 truncate"
                      title={banner.title}
                    >
                      {banner.title}
                    </p>
                    <Button
                      type="text"
                      danger
                      aria-label={`Delete ${banner.title}`}
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setDeleteTarget(banner)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Banner Modal */}
      <Modal
        title="Add banner"
        open={addOpen}
        onCancel={closeAdd}
        onOk={handleCreate}
        okText="Add banner"
        cancelText="Cancel"
        confirmLoading={isCreating}
        okButtonProps={{ style: { backgroundColor: BRAND } }}
        maskClosable={!isCreating}
        centered
        destroyOnClose
      >
        <div className="space-y-5 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              placeholder="e.g. Summer offer"
              value={title}
              maxLength={80}
              status={errors.title ? "error" : ""}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title)
                  setErrors((er) => ({ ...er, title: undefined }));
              }}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            {file ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={previewUrl}
                  alt="Selected banner"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label="Remove image"
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="px-3 py-2 text-xs text-gray-500 truncate bg-white">
                  {file.name}
                </p>
              </div>
            ) : (
              <Upload.Dragger
                accept="image/*"
                multiple={false}
                maxCount={1}
                showUploadList={false}
                beforeUpload={handleSelectFile}
              >
                <div className="py-4 flex flex-col items-center gap-2">
                  <ImagePlus className="w-8 h-8" style={{ color: ACCENT }} />
                  <p className="text-gray-800 font-medium">
                    Click or drag an image here
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or WEBP, up to {MAX_SIZE_MB}MB
                  </p>
                </div>
              </Upload.Dragger>
            )}
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete banner"
        open={!!deleteTarget}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
        onOk={handleDelete}
        okText="Yes, delete"
        cancelText="Cancel"
        confirmLoading={isDeleting}
        okButtonProps={{ danger: true }}
        centered
      >
        <p className="text-gray-700">
          Are you sure you want to delete <b>{deleteTarget?.title}</b>?
        </p>
        <p className="text-gray-500 text-sm mt-2">
          It will be removed from the app right away. You can't undo this.
        </p>
      </Modal>
    </div>
  );
}
