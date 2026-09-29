import { useState } from "react";

import {
  Avatar,
  Button,
  Calendar,
  ConfigProvider,
  Input,
  Modal,
  Pagination,
  Table,
} from "antd";
// import {  Calendar as CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { usePaymentTrackingQuery } from "../../redux/feature/others/othersApi";

const PaymentTrack = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [fromDate, setFromDate] = useState(dayjs("2025-06-16"));
  const [toDate, setToDate] = useState(dayjs("2025-09-10"));
  const [activeRange, setActiveRange] = useState("Custom Range");
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const { data: transactions } = usePaymentTrackingQuery({
    limit: pageSize,
    page,
  });
  console.log("all payments--------->", transactions);

  const handlePageChange = (page) => setPage(page);

  const columns = [
    {
      title: "Provider",
      dataIndex: "Provider",
      key: "Provider",
      render: (provider, record) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.providerProfilePicture} size={40} />
          <span>{provider}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "Date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Package",
      dataIndex: "Package",
      key: "Package",
      render: (text) => <b className="text-blue-700">{text}</b>,
    },
    {
      title: "Email",
      dataIndex: "providerEmail",
      key: "Email",
    },
    {
      title: "Phone Number",
      dataIndex: "providerPhoneNumber",
      key: "Phone",
    },
    {
      title: "Transaction No",
      dataIndex: "transactionId",
      key: "TransactionNo",
    },
    {
      title: "Commission",
      dataIndex: "amount",
      key: "Commission",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
  ];

  return (
    <div className=" p-5 font-nunito">
      {/* Header */}
      <div className="flex items-center justify-between py-5">
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment & Commission Tracking
        </h1>
        {/* <div className="flex items-center gap-3">
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
          dataSource={transactions?.data?.transactions}
          pagination={false}
          rowKey="key"
          bordered={false}
          className="shadow-sm"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }
          onHeaderRow={() => {
            return {
              className: "bg-[#1B2D51] text-white text-sm font-semibold",
            };
          }}
        />
      </ConfigProvider>

      {/* Pagination */}
      <div className="flex justify-center items-center">
        <Pagination
          current={page}
          total={transactions?.data?.pagination?.total}
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
            <Button
              type="primary"
              className="w-full mt-6 !bg-[#0A1F44] !h-10 rounded-lg"
            >
              Apply
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentTrack;
