import { useState } from "react";


import {
  Table,
  Pagination,
 
  Modal,
  Input,
  Calendar,
  ConfigProvider,
} from "antd";
import dayjs from "dayjs";
import { useGetRefferalQuery } from "../../redux/feature/others/othersApi";

const Refferal = () => {
  // const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [fromDate, setFromDate] = useState(dayjs("2025-06-16"));
  const [toDate, setToDate] = useState(dayjs("2025-09-10"));

  const [activeRange, setActiveRange] = useState("Custom Range");
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const { data: allReferal } = useGetRefferalQuery({
    page: currentPage,
    limit: pageSize,
  });
  console.log("all referral--->", allReferal);
  const handlePageChange = (page) => setCurrentPage(page);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Owner",
      dataIndex: "Name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.refereeProfilePicture}
            alt="Owner"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-sm">{text}</span>
        </div>
      ),
    },
    {
      title: "Reffered Name",
      dataIndex: "ReferredName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.referrerProfilePicture}
            alt="Provider"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-sm">{record.ReferredName}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Email",
      dataIndex: "Email",
    },
    {
      title: "Reffered Email",
      dataIndex: "ReferredEmail",
    },
    {
      title: "Role",
      dataIndex: "referrerRole",
    },
    {
      title: "Bonus",
      dataIndex: "creditsEarned",
    },
  ];

  return (
    <div className="p-5 font-sans">
      {/* Header */}
      {/* Header */}
      <div className="flex items-center justify-between py-5">
        <h1 className="text-2xl font-semibold text-gray-900">
          Referral Program Management
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
          dataSource={allReferal?.data}
          pagination={false}
          rowKey="id"
          className="rounded-lg border overflow-hidden"
        />
      </ConfigProvider>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6">
        <Pagination
          current={currentPage}
          total={allReferal?.meta?.total}
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
            <button className="w-full p-2 rounded-xl bg-[#0A1F44] ">
              Apply
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Refferal;
