import React, { useState } from "react";
import {
  Table,
  Button,
  Avatar,
  Modal,
  Tag,
  Pagination,
  Input,
  ConfigProvider,
} from "antd";
import { Expand, Search, UserX } from "lucide-react";

import {
  useBlockUsersMutation,
  useGetAllOwnersQuery,
  useSingleUsersQuery,
} from "../../redux/feature/userManagement/userManagementApi";
import toast from "react-hot-toast";

const AllOwner = () => {
  const [searchText, setSearchText] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [id, setId] = useState("");
  const dataLimit = 10;
  const { data: allOwners } = useGetAllOwnersQuery({ limit: dataLimit, page });
  const handlePageChange = (page) => {
    setPage(page);
  };
  const { data: singleUser } = useSingleUsersQuery(id, { skip: !id });
  const [blockUser] = useBlockUsersMutation();
  //   const { data: searchData } = useSearchUsersQuery(searchTerm);
  // console.log("search users----->",searchData);
  console.log("single users----->", singleUser);
  const filteredUsers = allOwners?.data?.filter((user) => {
    // Ensure that user.name and user.email are defined before calling toLowerCase
    const searchMatch =
      (user.name &&
        user.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchText.toLowerCase()));

    return searchMatch;
  });

  const handleOverviewClick = (user) => {
    setId(user?._id);
    setModalVisible(true);
  };

  const handleBlockClick = (user) => {
    setId(user?._id);
    setBlockModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleBlockCloseModal = () => {
    setBlockModalVisible(false);
  };
  // block user method
  const handleBlockUser = async () => {
    const data = { isActive: false };
    try {
      const res = await blockUser({ data, id });
      console.log("response---->", res);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log("Error", error);
      toast?.error(error?.message);
    }

    setBlockModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "userName",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.profilePicture} size={40} />
          <span className="font-medium text-gray-900">{text}</span>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
           render: (text) => <span className="text-gray-600">{text?.split('T')[0]}</span>,
    },
    {
      title: "Phone No",
      dataIndex: "phoneNumber",
      key: "phone",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <Tag color={status === 'Accept' ? "orange" : status === 'Reject' ? 'red' : 'gray'} className="px-3 py-1 rounded font-medium border-0">
    //       {status}
    //     </Tag>
    //   ),
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="text"
            icon={<Expand className="w-4 h-4" />}
            className="text-gray-400 hover:text-gray-600"
            onClick={() => handleOverviewClick(record)}
          />
          <Button
            type="text"
            icon={<UserX className="w-4 h-4 text-red-600" />}
            className="text-gray-400 hover:text-gray-600 ml-3"
            onClick={() => handleBlockClick(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between py-5">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            All Owner Details
          </h1>
        </div>
        <div className="relative">
          <Input
            placeholder="Search"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
          />
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#00c0b5",
            },
            Pagination: {
              colorPrimaryBorder: "#00c0b5",
              colorBorder: "#00c0b5",
              colorPrimaryHover: "#00c0b5",
              colorTextPlaceholder: "#00c0b5",
              itemActiveBgDisabled: "#00c0b5",
              colorPrimary: "#00c0b5",
            },
            Table: {
              headerBg: "#1B2D51",
              headerColor: "rgb(255,255,255)",
              cellFontSize: 16,
              headerSplitColor: "#1D4ED8",
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={false}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }
        />
      </ConfigProvider>

      {/* Pagination */}
      <div className="flex justify-center items-center">
        <Pagination
          current={page}
          total={allOwners?.meta?.total}
          pageSize={dataLimit}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {/* User Overview Modal */}
      <Modal
        title="User Overview"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        {singleUser && (
          <div className="pb-6">
            <div className="flex justify-center py-5 shadow-2xl">
              <img
                src={singleUser?.data?.profilePicture}
                alt={singleUser?.data?.userName}
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>

            <div className="bg-gray-100 w-full">
              <div className="space-y-4 px-5 py-5">
                {Object.keys(singleUser?.data)?.map((key) => {
                  if (key === "_id") return null;
                  if (key === "NIDFront") return null;
                  if (key === "profilePicture") return null;
                  if (key === "createdAt") return null;
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="text-gray-900">
                        {typeof singleUser?.data?.[key] === "string"
                          ? singleUser?.data?.[key]
                          : JSON.stringify(singleUser?.data?.[key])}
                      </div>
                    </div>
                  );
                })}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Id Card
                  </label>
                  <img
                    src={singleUser?.data?.NIDFront}
                    alt="ID Card"
                    className="w-full max-w-xs h-24 object-cover rounded border"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Block User Modal */}
      <Modal
        title="Block User"
        visible={blockModalVisible}
        onCancel={handleBlockCloseModal}
        footer={[
          <Button key="back" onClick={handleBlockCloseModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleBlockUser}>
            Block User
          </Button>,
        ]}
      >
        Are you sure you want to block {singleUser?.userName}?
      </Modal>
    </div>
  );
};

export default AllOwner;
