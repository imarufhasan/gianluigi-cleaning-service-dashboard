import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Table,
  Button,
  Input,
  Avatar,
  Modal,
  Pagination,
  ConfigProvider,
  Skeleton,
  Empty,
  message,
} from "antd";
import { Search, Expand, Lock, Unlock } from "lucide-react";
import {
  useGetAllOwnersQuery,
  useGetAllProvidersQuery,
  useSingleUsersQuery,
  useLockUnlockUserMutation,
} from "../../redux/feature/userManagement/userManagementApi";

const DATA_LIMIT = 10;
const TEAL = "#00c0b5";

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

// Backend: lockStatus = "lock" mane locked, "unlock" (ba onno kichu) mane unlocked.
// Meaning ulta hole shudhu ei ek line change korlei hobe.
const isLockedValue = (value) => /^lock/i.test(String(value ?? ""));

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
  const isOwner = String(role).toLowerCase().includes("owner");
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        isOwner ? "bg-blue-50 text-blue-700" : "bg-teal-50 text-teal-700"
      }`}
    >
      {role ? role.replace(/_/g, " ").toLowerCase() : "-"}
    </span>
  );
}

function StatusBadge({ locked }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        locked ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${locked ? "bg-red-500" : "bg-green-500"}`}
      />
      {locked ? "Locked" : "Active"}
    </span>
  );
}

function LockButton({ locked, onClick }) {
  return (
    <Button
      size="small"
      danger={!locked}
      type={locked ? "primary" : "default"}
      icon={
        locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />
      }
      onClick={onClick}
      style={locked ? { backgroundColor: TEAL } : undefined}
    >
      {locked ? "Unlock" : "Lock"}
    </Button>
  );
}

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("Owner");
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [overviewId, setOverviewId] = useState("");
  const [overviewOpen, setOverviewOpen] = useState(false);

  // Lock / Unlock
  const [lockTarget, setLockTarget] = useState(null);
  // API success hole sathe sathe UI update korar jonno: { [userId]: "lock" | "unlock" }
  const [lockOverrides, setLockOverrides] = useState({});

  const isOwnerTab = activeTab === "Owner";

  // Shudhu active tab er data fetch hoy
  const ownersQuery = useGetAllOwnersQuery(
    { limit: DATA_LIMIT, page },
    { skip: !isOwnerTab },
  );
  const providersQuery = useGetAllProvidersQuery(
    { limit: DATA_LIMIT, page },
    { skip: isOwnerTab },
  );
  const activeQuery = isOwnerTab ? ownersQuery : providersQuery;

  const { data: singleUser, isFetching: isOverviewLoading } =
    useSingleUsersQuery(overviewId, {
      skip: !overviewId,
      refetchOnMountOrArgChange: true,
    });
  const [lockUnlockUser, { isLoading: isLocking }] =
    useLockUnlockUserMutation();

  const allUsers = activeQuery.data?.data || [];
  const total = activeQuery.data?.meta?.total || 0;

  // Server theke notun data ashle override clear (server-i truth)
  useEffect(() => {
    setLockOverrides({});
  }, [activeQuery.data]);

  const getLockStatus = (user) => lockOverrides[user?._id] ?? user?.lockStatus;
  const isLocked = (user) => isLockedValue(getLockStatus(user));

  // Search: current page er data er upor
  const users = allUsers.filter((user) => {
    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    return (
      user.userName?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phoneNumber?.toLowerCase().includes(q)
    );
  });

  // ---------- Handlers ----------
  const changeTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearchText("");
  };

  const openOverview = (user) => {
    setOverviewId(user._id);
    setOverviewOpen(true);
  };

  const willLock = lockTarget ? !isLocked(lockTarget) : true;

  const handleConfirmLock = async () => {
    if (!lockTarget) return;
    const nextStatus = willLock ? "lock" : "unlock";

    try {
      await lockUnlockUser({
        id: lockTarget._id,
        data: { status: nextStatus },
      }).unwrap();
      setLockOverrides((prev) => ({ ...prev, [lockTarget._id]: nextStatus })); // UI instantly update
      message.success(
        `${lockTarget.userName} ${willLock ? "locked" : "unlocked"}`,
      );
      setLockTarget(null);
      activeQuery.refetch(); // server theke fresh list
    } catch (err) {
      message.error(
        err?.data?.message || "Could not update the account. Try again.",
      );
    }
  };

  // ---------- Table columns ----------
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
          <span className="font-medium text-gray-900">{text}</span>
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
    // {
    //   title: "Status",
    //   key: "status",
    //   render: (_, record) => <StatusBadge locked={isLocked(record)} />,
    // },
    {
      title: "Overview",
      key: "overview",
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          aria-label={`View ${record.userName}`}
          icon={<Expand className="h-4 w-4" />}
          className="text-gray-400 hover:text-gray-600"
          onClick={() => openOverview(record)}
        />
      ),
    },
    {
      title: "Lock / Unlock",
      key: "lock",
      align: "center",
      render: (_, record) => (
        <LockButton
          locked={isLocked(record)}
          onClick={() => setLockTarget(record)}
        />
      ),
    },
  ];

  const overviewUser = singleUser?.data;

  return (
    <div className="mx-auto w-full max-w-10xl font-title">
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              User Management
            </h1>
            <div className="flex rounded-lg bg-gray-100 p-1">
              {["Owner", "Provider"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => changeTab(tab)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
                    activeTab === tab
                      ? "bg-slate-800 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <Input
            allowClear
            placeholder="Search name, email or phone"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full lg:w-72"
          />
        </div>

        {/* Tablet / desktop: table */}
        <div className="hidden md:block">
          <ConfigProvider
            theme={{
              components: {
                Pagination: { colorPrimary: TEAL },
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
              dataSource={users}
              loading={activeQuery.isFetching}
              pagination={false}
              scroll={{ x: "max-content" }}
              locale={{
                emptyText: (
                  <Empty
                    description={
                      searchText
                        ? "No users match your search."
                        : "No users yet."
                    }
                  />
                ),
              }}
              rowClassName={(_, index) =>
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }
            />
          </ConfigProvider>
        </div>

        {/* Phone: card list */}
        <div className="md:hidden">
          {activeQuery.isLoading ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} active avatar paragraph={{ rows: 3 }} />
              ))}
            </div>
          ) : users.length === 0 ? (
            <Empty
              description={
                searchText ? "No users match your search." : "No users yet."
              }
              className="py-10"
            />
          ) : (
            <ul
              className={`divide-y divide-gray-100 ${activeQuery.isFetching ? "opacity-60" : ""}`}
            >
              {users.map((user) => (
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
                    <StatusBadge locked={isLocked(user)} />
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      size="small"
                      icon={<Expand className="h-4 w-4" />}
                      onClick={() => openOverview(user)}
                    >
                      Overview
                    </Button>
                    <LockButton
                      locked={isLocked(user)}
                      onClick={() => setLockTarget(user)}
                    />
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
        title="User overview"
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
                <StatusBadge
                  locked={isLocked({ ...overviewUser, _id: overviewId })}
                />
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

      {/* Lock / Unlock Confirmation Modal */}
      <Modal
        title={willLock ? "Lock account" : "Unlock account"}
        open={!!lockTarget}
        onCancel={() => !isLocking && setLockTarget(null)}
        onOk={handleConfirmLock}
        confirmLoading={isLocking}
        okText={willLock ? "Yes, lock" : "Yes, unlock"}
        cancelText="Cancel"
        okButtonProps={
          willLock ? { danger: true } : { style: { backgroundColor: TEAL } }
        }
        centered
      >
        <p className="text-gray-700">
          Are you sure you want to <b>{willLock ? "lock" : "unlock"}</b>{" "}
          <b>{lockTarget?.userName}</b>?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {willLock
            ? "They won't be able to use their account until you unlock it."
            : "They will be able to use their account again."}
        </p>
      </Modal>
    </div>
  );
}
