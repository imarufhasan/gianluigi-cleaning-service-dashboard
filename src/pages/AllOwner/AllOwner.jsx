import { useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  Table,
  Button,
  Avatar,
  Modal,
  Pagination,
  Input,
  ConfigProvider,
  Skeleton,
  Empty,
  Tooltip,
} from "antd";
import { Expand, Search, UserX } from "lucide-react";
import {
  useBlockUsersMutation,
  useGetAllOwnersQuery,
  useSingleUsersQuery,
} from "../../redux/feature/userManagement/userManagementApi";

const DATA_LIMIT = 10;
const TEAL = "#00c0b5";

// Overview modal e alada dekhai ba lukai
const HIDDEN_FIELDS = [
  "_id",
  "__v",
  "NIDFront",
  "NIDBack",
  "profilePicture",
  "userName",
  "createdAt",
  "updatedAt",
  "password",
  "lockStatus",
];

const formatDate = (value) =>
  value ? dayjs(value).format("DD MMM YYYY") : "-";
const prettyLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return JSON.stringify(value);
};

function RoleBadge({ role }) {
  return (
    <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-700">
      {role ? role.replace(/_/g, " ").toLowerCase() : "-"}
    </span>
  );
}

// Backend jodi `isActive: false` pathay tokhon-i dekhabe
function BlockedBadge({ user }) {
  if (user?.isActive !== false) return null;
  return (
    <span className="inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
      Blocked
    </span>
  );
}

const AllOwner = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [overviewId, setOverviewId] = useState("");
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [blockTarget, setBlockTarget] = useState(null);

  const { data, isLoading, isFetching, refetch } = useGetAllOwnersQuery({
    limit: DATA_LIMIT,
    page,
  });
  const { data: singleUser, isFetching: isOverviewLoading } =
    useSingleUsersQuery(overviewId, {
      skip: !overviewId,
      refetchOnMountOrArgChange: true,
    });
  const [blockUser, { isLoading: isBlocking }] = useBlockUsersMutation();

  const allOwners = data?.data || [];
  const total = data?.meta?.total || 0;

  // Search: current page er data er upor (name, email, phone)
  const owners = allOwners.filter((user) => {
    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    return (
      user.userName?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phoneNumber?.toLowerCase().includes(q)
    );
  });

  const openOverview = (user) => {
    setOverviewId(user._id);
    setOverviewOpen(true);
  };

  const handleBlockUser = async () => {
    if (!blockTarget) return;
    try {
      const res = await blockUser({
        data: { isActive: false },
        id: blockTarget._id,
      }).unwrap();
      toast.success(res?.message || `${blockTarget.userName} blocked`);
      setBlockTarget(null);
      refetch();
    } catch (err) {
      toast.error(
        err?.data?.message || "Could not block this user. Try again.",
      );
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "userName",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.profilePicture} size={40}>
            {text?.[0]?.toUpperCase()}
          </Avatar>
          <div className="flex flex-col items-start gap-1">
            <span className="font-medium text-gray-900">{text}</span>
            <BlockedBadge user={record} />
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (r) => <RoleBadge role={r} />,
    },
    { title: "Date", dataIndex: "createdAt", key: "date", render: formatDate },
    {
      title: "Phone No",
      dataIndex: "phoneNumber",
      key: "phone",
      render: (t) => t || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (t) => t || "-",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (t) => (
        <span className="block max-w-[220px] truncate" title={t}>
          {t || "-"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="View details">
            <Button
              type="text"
              aria-label={`View ${record.userName}`}
              icon={<Expand className="h-4 w-4" />}
              className="text-gray-400 hover:text-gray-600"
              onClick={() => openOverview(record)}
            />
          </Tooltip>
          <Tooltip title="Block user">
            <Button
              type="text"
              danger
              aria-label={`Block ${record.userName}`}
              disabled={record.isActive === false}
              icon={<UserX className="h-4 w-4" />}
              onClick={() => setBlockTarget(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const overviewUser = singleUser?.data;
  const emptyText = searchText
    ? "No owners match your search."
    : "No owners yet.";

  return (
    <div className="mx-auto w-full max-w-7xl font-title">
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Owner Details
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {isLoading
                ? "Loading owners..."
                : `${total} ${total === 1 ? "owner" : "owners"} in total`}
            </p>
          </div>
          <Input
            allowClear
            placeholder="Search name, email or phone"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-72"
          />
        </div>

        {/* Tablet / desktop: table */}
        <div className="hidden md:block">
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#1B2D51",
                  headerColor: "rgb(255,255,255)",
                  cellFontSize: 15,
                  headerSplitColor: "#1D4ED8",
                },
              },
            }}
          >
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={owners}
              loading={isFetching}
              pagination={false}
              scroll={{ x: "max-content" }}
              locale={{ emptyText: <Empty description={emptyText} /> }}
              rowClassName={(_, index) =>
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }
            />
          </ConfigProvider>
        </div>

        {/* Phone: card list */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} active avatar paragraph={{ rows: 3 }} />
              ))}
            </div>
          ) : owners.length === 0 ? (
            <Empty description={emptyText} className="py-10" />
          ) : (
            <ul
              className={`divide-y divide-gray-100 ${isFetching ? "opacity-60" : ""}`}
            >
              {owners.map((user) => (
                <li key={user._id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar src={user.profilePicture} size={44}>
                      {user.userName?.[0]?.toUpperCase()}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium text-gray-900">
                          {user.userName}
                        </p>
                        <RoleBadge role={user.role} />
                        <BlockedBadge user={user} />
                      </div>
                      <p className="mt-0.5 truncate text-sm text-gray-600">
                        {user.email || "-"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.phoneNumber || "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.address || "-"}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Joined {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      size="small"
                      icon={<Expand className="h-4 w-4" />}
                      onClick={() => openOverview(user)}
                    >
                      Overview
                    </Button>
                    <Button
                      size="small"
                      danger
                      disabled={user.isActive === false}
                      icon={<UserX className="h-4 w-4" />}
                      onClick={() => setBlockTarget(user)}
                    >
                      Block
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-center border-t border-gray-100 py-4">
            <ConfigProvider
              theme={{ components: { Pagination: { colorPrimary: TEAL } } }}
            >
              <Pagination
                current={page}
                total={total}
                pageSize={DATA_LIMIT}
                onChange={setPage}
                showSizeChanger={false}
                size="small"
              />
            </ConfigProvider>
          </div>
        )}
      </div>

      {/* User Overview Modal */}
      <Modal
        title="Owner overview"
        open={overviewOpen}
        onCancel={() => setOverviewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setOverviewOpen(false)}>
            Close
          </Button>,
        ]}
        centered
        width={520}
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      >
        {isOverviewLoading || !overviewUser ? (
          <Skeleton active avatar paragraph={{ rows: 6 }} />
        ) : (
          <div>
            <div className="flex flex-col items-center gap-2 border-b border-gray-100 pb-5">
              <Avatar src={overviewUser.profilePicture} size={80}>
                {overviewUser.userName?.[0]?.toUpperCase()}
              </Avatar>
              <p className="text-lg font-semibold text-gray-900">
                {overviewUser.userName}
              </p>
              <div className="flex items-center gap-2">
                <RoleBadge role={overviewUser.role} />
                <BlockedBadge user={overviewUser} />
              </div>
            </div>

            <dl className="mt-4 space-y-3 rounded-lg bg-gray-50 p-4">
              <div>
                <dt className="text-xs font-medium text-gray-500">Joined</dt>
                <dd className="text-gray-900">
                  {formatDate(overviewUser.createdAt)}
                </dd>
              </div>
              {Object.keys(overviewUser)
                .filter((key) => !HIDDEN_FIELDS.includes(key))
                .map((key) => (
                  <div key={key}>
                    <dt className="text-xs font-medium text-gray-500">
                      {prettyLabel(key)}
                    </dt>
                    <dd className="break-words text-gray-900">
                      {formatValue(overviewUser[key])}
                    </dd>
                  </div>
                ))}
            </dl>

            {(overviewUser.NIDFront || overviewUser.NIDBack) && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-gray-500">
                  ID card
                </p>
                <div className="flex flex-wrap gap-3">
                  {[overviewUser.NIDFront, overviewUser.NIDBack]
                    .filter(Boolean)
                    .map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt="ID card"
                        className="h-28 w-full max-w-[220px] rounded border object-cover"
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Block Confirmation Modal */}
      <Modal
        title="Block user"
        open={!!blockTarget}
        onCancel={() => !isBlocking && setBlockTarget(null)}
        onOk={handleBlockUser}
        confirmLoading={isBlocking}
        okText="Yes, block"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        centered
      >
        <p className="text-gray-700">
          Are you sure you want to block <b>{blockTarget?.userName}</b>?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          They won't be able to use their account until you activate it again.
        </p>
      </Modal>
    </div>
  );
};

export default AllOwner;
