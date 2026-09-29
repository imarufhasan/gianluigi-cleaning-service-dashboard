import  { useState } from "react";
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
import { Expand, Search} from "lucide-react";

import { useGetAllBookingQuery } from "../../redux/feature/userManagement/userManagementApi";


const Request = () => {

  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [page, setPage] = useState(1);

  const dataLimit = 10;
  const { data: allBooking } = useGetAllBookingQuery({
    limit: dataLimit,
    page,
  });
  const handlePageChange = (page) => {
    setPage(page);
  };
console.log("all booking----->",allBooking?.data);

  const filteredUsers = allBooking?.data?.filter((user) => {
    // Ensure that user.name and user.email are defined before calling toLowerCase
    const searchMatch =
      (user.ownerName || user.providerName &&
        user.ownerName.toLowerCase().includes(searchText.toLowerCase())) ||
        user.providerName.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchText.toLowerCase()));

    return searchMatch;
  });

  const handleOverviewClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const columns = [
    // {
    //   title: "#",
    //   dataIndex: "id",
    //   key: "id",

    // },
    {
      title: "Owner",
      dataIndex: "ownerName",
      key: "owner",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.ownerProfilePicture} size={40} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Provider",
      dataIndex: "providerName",
      key: "provider",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.providerProfilePicture} size={40} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render:(text)=>(<div><p>{text?.split('T')[0]}</p></div>)
    },
    {
      title: "Service Duration",
      dataIndex: "serviceDuration",
      key: "category",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <b>${text}</b>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "COMPLETED"
              ? "green"
              : status === "CANCELLED"
              ? "red"
              : "orange"
          }
          className="px-3 py-1 rounded font-medium border-0"
        >
          {status}
        </Tag>
      ),
    },
    // {
    //   title: "Overview",
    //   key: "actions",
    //   render: (_, record) => (
    //     <div>
    //       <Button
    //         type="text"
    //         icon={<Expand className="w-4 h-4" />}
    //         onClick={() => handleOverviewClick(record)}
    //       />
    //     </div>
    //   ),
    // },
  ];

  return (
    <div>
      <div className="flex items-center justify-between py-5">
        <h1 className="text-2xl font-semibold text-gray-900">
          Request Overview
        </h1>
        {/* <div className="relative">
          <Input
            placeholder="Search"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64"
          />
        </div> */}
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
          rowKey="id"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }
        />
      </ConfigProvider>
      {/* Pagination */}
      <div className="flex justify-center items-center">
        <Pagination
          current={page}
          total={allBooking?.meta?.total}
          pageSize={dataLimit}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {/* Overview Modal */}
      <Modal
        title={null}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
        centered
      >
        {selectedUser && (
          <div className="pb-6">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Owner and provider</h2>
            </div>

            {/* Profile Images with "To" in the middle */}
            <div className="flex items-center justify-between px-10 gap-10 py-8">
              <div className="flex flex-col items-center">
                <img
                  src={selectedUser.owner.avatar}
                  alt={selectedUser.owner.name}
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
                <p className="font-semibold">{selectedUser.owner.name}</p>
              </div>

              {/* "To" text */}
              <div className="text-lg font-bold text-gray-700">To</div>

              <div className="flex flex-col items-center mr-56">
                <img
                  src={selectedUser.provider.avatar}
                  alt={selectedUser.provider.name}
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
                <p className="font-semibold">{selectedUser.provider.name}</p>
              </div>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-2 gap-12 px-12 py-6 text-sm leading-6">
              {/* Owner Details */}
              <div className="space-y-3">
                <p>
                  <b>Name:</b> {selectedUser.owner.name}
                </p>
                <p>
                  <b>Role:</b> Owner
                </p>
                <p>
                  <b>Date:</b> {selectedUser.bookingDate}
                </p>
                <p>
                  <b>Phone Number:</b> {selectedUser.phone}
                </p>
                <p>
                  <b>Email:</b> {selectedUser.email}
                </p>
                <p>
                  <b>Address:</b> {selectedUser.address}
                </p>
                <p>
                  <b>Referral by:</b> {selectedUser.referredBy}
                </p>
                <p>
                  <b>Total Order:</b> 15
                </p>
                <p>
                  <b>Completed:</b> 10
                </p>
                <p>
                  <b>Cancelled:</b> 5
                </p>
              </div>

              {/* Provider Details */}
              <div className="space-y-3">
                <p>
                  <b>Name:</b> {selectedUser.provider.name}
                </p>
                <p>
                  <b>Service Category:</b>
                </p>
                <ul className="list-disc ml-6">
                  <li>Cleaning</li>
                  <li>Laundry</li>
                </ul>
                <p>
                  <b>Role:</b> Service Provider
                </p>
                <p>
                  <b>Date:</b> {selectedUser.bookingDate}
                </p>
                <p>
                  <b>Phone Number:</b> {selectedUser.phone}
                </p>
                <p>
                  <b>Email:</b> {selectedUser.email}
                </p>
                <p>
                  <b>Address:</b> {selectedUser.address}
                </p>
                <p>
                  <b>Experience:</b> 2 Years
                </p>
                <p>
                  <b>Referral by:</b> {selectedUser.referredBy}
                </p>
                <p>
                  <b>Total Order:</b> 50
                </p>
                <p>
                  <b>Completed:</b> 30
                </p>
                <p>
                  <b>Cancelled:</b> 20
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Request;
