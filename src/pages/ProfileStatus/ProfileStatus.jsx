import { useState } from "react";
import {
  Table,
  Button,
  Input,
  Avatar,

  Pagination,
  ConfigProvider,

} from "antd";
import { CalendarIcon, Search } from "lucide-react";

import { useGetAllOwnersProfileQuery, useGetAllProvidersProfileQuery } from "../../redux/feature/userManagement/userManagementApi";



export default function ProfileStatus() {
  const [activeTab, setActiveTab] = useState("Owner"); // Default is Owner
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
    // Fetch data based on active tab
    const { data: allOwners } = useGetAllOwnersProfileQuery({ limit: pageSize, page:currentPage });
    const { data: allProviders } = useGetAllProvidersProfileQuery({ limit: pageSize, page:currentPage});
  

const filteredUsers = (activeTab === "Owner" ? allOwners?.data : allProviders?.data)?.filter((user) => {
  // Ensure that user.name and user.email are defined before calling toLowerCase
  const searchMatch =
    (user.userName && user.userName.toLowerCase().includes(searchText.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchText.toLowerCase()));

  return searchMatch;
});





  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) =>
        (currentPage - 1) * pageSize + index + 1,
    },
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
    // {
    //   title: "Date",
    //   dataIndex: "date",
    //   key: "date",
    //   render: (text) => <span className="text-gray-600">{text}</span>,
    // },
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
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
    },
    {
      title: "Pending",
      dataIndex: "pending",
      key: "pending",
    },
    {
      title: "Cancelled",
      dataIndex: "cancelled",
      key: "cancelled",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "cancelled",
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-semibold text-gray-900">
               Profile Status
              </h1>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("Owner")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "Owner"
                      ? "bg-slate-800 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Owner
                </button>
                <button
                  onClick={() => setActiveTab("Service Provider")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "Service Provider"
                      ? "bg-slate-800 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Provider
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
                  
                            <Input
                              placeholder="Search"
                              prefix={<Search className="w-4 h-4 text-gray-400" />}
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                              className="w-64"
                            />
          {/* <Button
            type="default"
            className="flex items-center gap-2 border rounded px-3 py-1"
            onClick={() => setCalendarModalVisible(true)}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>16 June to 10 Sep 2025</span>
          </Button> */}
        </div>
          </div>
        </div>

        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                colorPrimary: "#00c0b5",
              },
              Table: {
                headerBg: "#1B2D51",
                headerColor: "#fff",
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
            className="custom-table text-center"
            rowClassName={(record, index) =>
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }
          />
        </ConfigProvider>

        {/* Pagination */}
        <div className="flex justify-center items-center">
          <Pagination
            current={currentPage}
        total={activeTab === "Owner" ? allOwners?.meta?.total : allProviders?.meta?.total}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="my-4 text-center"
          />
        </div>
      </div>
 
    </div>
  );
}
