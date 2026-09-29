
import { useState } from "react"
import { Search, CalendarIcon, Star } from "lucide-react"

import { Table, Pagination, Select, Button, Modal, Input, Calendar, ConfigProvider } from "antd"
import dayjs from "dayjs";
import { useGetSuspentionsQuery, useSuspenseStatusChangeMutation } from "../../redux/feature/others/othersApi";
import toast from "react-hot-toast";


const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : star === Math.ceil(rating) && rating % 1 !== 0
            ? "fill-yellow-400/50 text-yellow-400"
            : "fill-gray-200 text-gray-200"}`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating}</span>
    </div>
  )
}

const AccountSuspention = () => {
const [changeStatus]=useSuspenseStatusChangeMutation()
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10
    const [fromDate, setFromDate] = useState(dayjs("2025-06-16"));
    const [toDate, setToDate] = useState(dayjs("2025-09-10"));

    const [activeRange, setActiveRange] = useState("Custom Range");
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
const {data:allSuspention}=useGetSuspentionsQuery({page,limit:pageSize})
console.log("all suspention---------->",allSuspention);
  const handlePageChange = (page) => setPage(page)



    // Updated handleStatusChange function
  const handleStatusChange = async (status,record) => {
    const value = status === "Active" ? true : false;  // Determine the status value based on selected option
    const id = record?._id;

    const data = { isActive: value };
console.log("data-->",data);
console.log("record-->",record);
    try {
      const res = await changeStatus({ data, id });
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
  }


  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Owner",
      dataIndex: "ownerUserName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img src={record.ownerProfilePicture} alt="Owner" className="w-10 h-10 rounded-full" />
          <span className="text-sm">{record.owner}</span>
        </div>
      ),
    },
    {
      title: "Provider",
      dataIndex: "providerUserName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img src={record.providerProfilePicture} alt="Provider" className="w-10 h-10 rounded-full" />
          <span className="text-sm">{record.provider}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "bookingDate",
         render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Owner-Email",
      dataIndex: "ownerEmail",
    },
    {
      title: "Provider-Email",
      dataIndex: "providerEmail",
    },
    // {
    //   title: "Service",
    //   dataIndex: "providerAccountStatus",
    // },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (text, record) => <StarRating rating={record.rating} />,
    },
    {
      title: "Status",
      dataIndex: "providerAccountStatus",
      render: (text, record) => (
        <Select
          value={record.providerAccountStatus
}
             onChange={(status) => handleStatusChange(status, record)} 
          className={`w-32 text-sm ${record.status === "Suspended" ? "text-red-600" : "text-green-600"}`}
        >
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Suspended">Suspended</Select.Option>
        </Select>
      ),
    },
  ]

  return (
    <div className="p-5 font-sans">
      {/* Header */}
        {/* Header */}
      <div className="flex items-center justify-between py-5">
        <h1 className="text-2xl font-semibold text-gray-900">
   Account Suspention
        </h1>
        {/* <div className="flex items-center gap-3">
                  
                            <Input
                              placeholder="Search"
                              prefix={<Search className="w-4 h-4 text-gray-400" />}
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                              className="w-64"
                            />
          <Button
            type="default"
            className="flex items-center gap-2 border rounded px-3 py-1"
            onClick={() => setCalendarModalVisible(true)}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>16 June to 10 Sep 2025</span>
          </Button>
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


      {/* Table */}
      <Table
        columns={columns}
        dataSource={allSuspention?.data}
        pagination={false}
        rowKey="id"
        className="rounded-lg border overflow-hidden"
      />
      </ConfigProvider>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6">
        <Pagination
          current={page}
          total={allSuspention?.meta?.total}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          className="my-4"
        />
      </div>


            {/* Calendar Modal */}
      <Modal
        title={false}
        open={calendarModalVisible}
        onCancel={() => setCalendarModalVisible(false)}
        footer={null}
        centered
        width={1200}
      >
        <div className="flex">
          {/* Left side: Date pickers & calendars */}
          <div className="flex flex-col gap-6 w-2/3 p-6">
            {/* From / To Inputs */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block mb-1 font-medium">From</label>
                <Input value={fromDate.format("DD-MM-YYYY")} readOnly />
              </div>
              <div className="w-1/2">
                <label className="block mb-1 font-medium">To</label>
                <Input value={toDate.format("DD-MM-YYYY")} readOnly />
              </div>
            </div>

            {/* Two calendars side by side */}
            <div className="flex gap-4">
              <div className="border rounded p-2 w-1/2">
                <Calendar
                  fullscreen={false}
                  value={fromDate}
                  onSelect={(date) => setFromDate(date)}
                />
              </div>
              <div className="border rounded p-2 w-1/2">
                <Calendar
                  fullscreen={false}
                  value={toDate}
                  onSelect={(date) => setToDate(date)}
                />
              </div>
            </div>
          </div>

          {/* Right side: Quick filters */}
          <div className="flex flex-col justify-between border-l w-1/3 p-6">
            <div className="space-y-4">
              {[
                "Last 24 hours",
                "Last 7 days",
                "Last 30 days",
                "Custom Range",
              ].map((label) => (
                <p
                  key={label}
                  onClick={() => setActiveRange(label)}
                  className={`cursor-pointer px-2 py-1 rounded ${
                    activeRange === label
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:text-blue-600"
                  }`}
                >
                  {label}
                </p>
              ))}
            </div>
            <button

              className="w-full p-2 rounded-xl bg-[#0A1F44] "
            >
              Apply
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AccountSuspention
