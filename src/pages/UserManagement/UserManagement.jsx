import { useState } from "react";
import { Table, Button, Input, Avatar, Modal, Pagination, ConfigProvider } from "antd";
import { Search, Expand } from "lucide-react";
;
import { useGetAllOwnersQuery, useGetAllProvidersQuery, useSingleUsersQuery} from "../../redux/feature/userManagement/userManagementApi";

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [id, setId] = useState("");
  const dataLimit = 10;

  // Fetch data based on active tab
  const { data: allOwners } = useGetAllOwnersQuery({ limit: dataLimit, page });
  const { data: allProviders } = useGetAllProvidersQuery({ limit: dataLimit, page });

  // Handling tab selection
  const [activeTab, setActiveTab] = useState("Owner");
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
const { data: singleUser } = useSingleUsersQuery(id, {skip: !id,});

//   const { data: searchData } = useSearchUsersQuery(searchTerm);
// console.log("search users----->",searchData);
console.log("single users----->",singleUser);

  // Handle page change
  const onPageChange = (page) => {
    setPage(page);
  };

const filteredUsers = (activeTab === "Owner" ? allOwners?.data : allProviders?.data)?.filter((user) => {
  // Ensure that user.name and user.email are defined before calling toLowerCase
  const searchMatch =
    (user.name && user.name.toLowerCase().includes(searchText.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchText.toLowerCase()));

  return searchMatch;
});

  // Columns configuration
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
      render: (text) => new Date(text).toLocaleDateString(),
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
    {
      title: "Overview",
      key: "overview",
      render: (_, record) => (
        <Button
          type="text"
          icon={<Expand className="w-4 h-4" />}
          className="text-gray-400 hover:text-gray-600"
          onClick={() => handleOverviewClick(record)}
        />
      ),
    },
  ];

  // Overview click handler
  const handleOverviewClick = (user) => {
    console.log("single user----->",user);
   setId(user?._id)

    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);

  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
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
                    onClick={() => setActiveTab("Provider")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "Provider"
                        ? "bg-slate-800 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Provider
                  </button>
                </div>
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
          </div>

          <ConfigProvider
            theme={{
              components: {
                Pagination: {
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
              className="custom-table text-center"
              rowClassName={(record, index) => (index % 2 === 0 ? "bg-white" : "bg-gray-50")}
            />
          </ConfigProvider>

          {/* Pagination */}
          <div className="flex justify-center items-center">
            <Pagination
              current={page}
              total={activeTab === "Owner" ? allOwners?.meta?.total : allProviders?.meta?.total}
              pageSize={dataLimit}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      {/* User Overview Modal */}
       <Modal
           title="User Overview"
           visible={modalVisible}
           onCancel={handleCloseModal}
           footer={[<Button key="back" onClick={handleCloseModal}>Close</Button>]}
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
                     <label className="block text-sm font-medium text-gray-700 mb-1">Id Card</label>
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
    </div>
  );
}
