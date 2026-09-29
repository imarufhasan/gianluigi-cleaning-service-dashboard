import { Table, Skeleton, Empty } from "antd";
import dayjs from "dayjs";
import { useRecentJoinUsersQuery } from "../../redux/feature/others/othersApi";
import avatar from "../../assets/user.png";

const formatDate = (value) =>
  value ? dayjs(value).format("DD MMM YYYY") : "-";

const formatRole = (role) =>
  role ? role.replace(/_/g, " ").toLowerCase() : "-";

function RoleBadge({ role }) {
  const isOwner = String(role).toLowerCase().includes("owner");
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        isOwner ? "bg-blue-50 text-blue-700" : "bg-teal-50 text-teal-700"
      }`}
    >
      {formatRole(role)}
    </span>
  );
}

function UserAvatar({ user }) {
  return (
    <img
      src={user.profilePicture || avatar}
      alt={user.userName}
      className="h-10 w-10 shrink-0 rounded-full object-cover"
    />
  );
}

const columns = [
  {
    title: "#",
    key: "index",
    width: 56,
    render: (_, __, index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: "userName",
    key: "userName",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <UserAvatar user={record} />
        <span className="font-medium text-gray-900">{record.userName}</span>
      </div>
    ),
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role) => <RoleBadge role={role} />,
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: formatDate,
  },
  {
    title: "Phone No",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (v) => v || "-",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (v) => v || "-",
  },
];

export default function RecentJoin() {
  const { data, isLoading } = useRecentJoinUsersQuery(undefined);
  const users = data?.data || [];

  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-md">
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-gray-900 sm:text-xl">
          Recent Join Owner &amp; Service Provider
        </h2>
      </div>

      {/* Tablet and desktop: table */}
      <div className="hidden md:block">
        <Table
          dataSource={users}
          columns={columns}
          rowKey={(record) => record.id || record._id}
          loading={isLoading}
          pagination={false}
          scroll={{ x: "max-content" }}
          locale={{ emptyText: <Empty description="No recent users yet." /> }}
        />
      </div>

      {/* Phone: card list */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="p-4">
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </div>
        ) : users.length === 0 ? (
          <Empty description="No recent users yet." className="py-8" />
        ) : (
          <ul className="divide-y divide-gray-100">
            {users.map((user) => (
              <li key={user.id || user._id} className="flex gap-3 p-4">
                <UserAvatar user={user} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium text-gray-900">
                      {user.userName}
                    </p>
                    <RoleBadge role={user.role} />
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-600">
                    {user.email || "-"}
                  </p>
                  <div className="mt-1 flex flex-wrap justify-between gap-x-3 text-xs text-gray-500">
                    <span>{user.phoneNumber || "-"}</span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
