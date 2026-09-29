import { useState } from "react";

import { Avatar, Button, ConfigProvider, Input, Modal, Pagination, Table, Tag } from "antd";
import { Expand, Search, UserX } from "lucide-react";
import { useGetAllTransectionsQuery } from "../../redux/feature/userManagement/userManagementApi";



const TransactionHistory = () => {

  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

const {data:allTransaction}=useGetAllTransectionsQuery({limit:pageSize,page})
console.log("all transection--->",allTransaction);

  // Handle page change
  const onPageChange = (page) => {
    setPage(page);
  };
  const filteredUsers = allTransaction?.data?.transactions?.filter((user) => {
    // Ensure that user.name and user.email are defined before calling toLowerCase
    const searchMatch =
      (user.ownerName || user.providerName &&
        user.ownerName.toLowerCase().includes(searchText.toLowerCase())) ||
        user.providerName.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.ownerEmail || user?.providerEmail &&
        user.email.toLowerCase().includes(searchText.toLowerCase()));

    return searchMatch;
  });



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
      dataIndex: "createdAt",
      key: "bookingDate",
      render:(text)=>(<div><p>{text?.split('T')[0]}</p></div>)
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "category",
    },
    {
      title: "Tnxld",
      dataIndex: "transactionId",
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

       <div className="flex justify-center items-center">
            <Pagination
              current={page}
              total={allTransaction?.data?.pagination?.total}
              pageSize={pageSize}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>

      {/* Overview Modal */}
      <Modal
        title="User Overview"
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        {selectedUser && (
          <div className="pb-6">
            <div className="flex justify-center py-5 shadow-2xl">
              <img
                src={selectedUser.OwnerImage}
                alt={selectedUser.owner}
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
            <div className="bg-gray-100 w-full">
              <div className="space-y-4 px-5 py-5">
                <div>
                  <label className="block font-medium">Owner</label>
                  <p>{selectedUser.owner}</p>
                </div>
                <div>
                  <label className="block font-medium">Provider</label>
                  <p>{selectedUser.provider}</p>
                </div>
                <div>
                  <label className="block font-medium">Category</label>
                  <p>{selectedUser.category}</p>
                </div>
                <div>
                  <label className="block font-medium">Amount</label>
                  <p>{selectedUser.amount}</p>
                </div>
                <div>
                  <label className="block font-medium">Email</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block font-medium">Address</label>
                  <p>{selectedUser.address}</p>
                </div>
                <div>
                  <label className="block font-medium">ID Card</label>
                  <img
                    src={selectedUser.idCard}
                    alt="ID Card"
                    className="w-full max-w-xs h-24 object-cover rounded border"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
    );
};

export default TransactionHistory;