import dayjs from "dayjs";
import {
  Avatar,
  Button,
  ConfigProvider,
  Empty,
  Input,
  Modal,
  Pagination,
  Skeleton,
  Table,
} from "antd";
import { Search } from "lucide-react";

export const TEAL = "#00c0b5";
export const NAVY = "#1B2D51";

/* ---------- formatters ---------- */
export const formatDate = (value) =>
  value ? dayjs(value).format("DD MMM YYYY") : "-";
export const formatMoney = (value) =>
  `$${Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
export const humanize = (value) =>
  value ? String(value).replace(/_/g, " ").toLowerCase() : "-";
export const prettyLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
export const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return JSON.stringify(value);
};

/* ---------- badges ---------- */
export function RoleBadge({ role }) {
  const isOwner = String(role).toLowerCase().includes("owner");
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        isOwner ? "bg-blue-50 text-blue-700" : "bg-teal-50 text-teal-700"
      }`}
    >
      {humanize(role)}
    </span>
  );
}

// `isActive: false` ashle dekhabe
export function BlockedBadge({ user }) {
  if (user?.isActive !== false) return null;
  return (
    <span className="inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
      Blocked
    </span>
  );
}

const STATUS_STYLES = {
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-600",
  orange: "bg-orange-50 text-orange-600",
};
const statusTone = (status) => {
  const s = String(status).toUpperCase();
  if (["COMPLETED", "SUCCESS", "SUCCEEDED", "PAID", "ACCEPTED"].includes(s))
    return "green";
  if (["CANCELLED", "CANCELED", "FAILED", "REJECTED", "REFUNDED"].includes(s))
    return "red";
  return "orange";
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        STATUS_STYLES[statusTone(status)]
      }`}
    >
      {humanize(status)}
    </span>
  );
}

/* ---------- small pieces ---------- */
export function PersonCell({ name, image, size = 40 }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar src={image} size={size} className="shrink-0">
        {name?.[0]?.toUpperCase()}
      </Avatar>
      <span className="truncate font-medium text-gray-900">{name || "-"}</span>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          {title}
        </h1>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search" }) {
  return (
    <Input
      allowClear
      placeholder={placeholder}
      prefix={<Search className="h-4 w-4 text-gray-400" />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-72"
    />
  );
}

export function PagerBar({ page, total, pageSize, onChange }) {
  if (!total) return null;
  return (
    <div className="flex items-center justify-center border-t border-gray-100 py-4">
      <ConfigProvider
        theme={{ components: { Pagination: { colorPrimary: TEAL } } }}
      >
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={onChange}
          showSizeChanger={false}
          hideOnSinglePage
          size="small"
        />
      </ConfigProvider>
    </div>
  );
}

/* Table (md+) with the project's navy header, horizontal scroll on small widths */
export function KitTable({
  columns,
  data,
  loading,
  emptyText = "Nothing here yet.",
}) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: NAVY,
            headerColor: "rgb(255,255,255)",
            cellFontSize: 15,
            headerSplitColor: "#1D4ED8",
          },
        },
      }}
    >
      <Table
        rowKey={(record) => record.id || record._id}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
        locale={{ emptyText: <Empty description={emptyText} /> }}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        }
      />
    </ConfigProvider>
  );
}

/* Phone card list wrapper: handles loading / empty / refetch dimming */
export function CardList({
  loading,
  fetching,
  items,
  emptyText = "Nothing here yet.",
  children,
}) {
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} active avatar paragraph={{ rows: 3 }} />
        ))}
      </div>
    );
  }
  if (items.length === 0)
    return <Empty description={emptyText} className="py-10" />;
  return (
    <ul className={`divide-y divide-gray-100 ${fetching ? "opacity-60" : ""}`}>
      {children}
    </ul>
  );
}

/* ---------- user overview modal ---------- */
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

export function UserOverviewModal({
  open,
  onClose,
  user,
  loading,
  title = "User overview",
}) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      centered
      width={520}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
    >
      {loading || !user ? (
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      ) : (
        <div>
          <div className="flex flex-col items-center gap-2 border-b border-gray-100 pb-5">
            <Avatar src={user.profilePicture} size={80}>
              {user.userName?.[0]?.toUpperCase()}
            </Avatar>
            <p className="text-lg font-semibold text-gray-900">
              {user.userName}
            </p>
            <div className="flex items-center gap-2">
              <RoleBadge role={user.role} />
              <BlockedBadge user={user} />
            </div>
          </div>

          <dl className="mt-4 space-y-3 rounded-lg bg-gray-50 p-4">
            <div>
              <dt className="text-xs font-medium text-gray-500">Joined</dt>
              <dd className="text-gray-900">{formatDate(user.createdAt)}</dd>
            </div>
            {Object.keys(user)
              .filter((key) => !HIDDEN_FIELDS.includes(key))
              .map((key) => (
                <div key={key}>
                  <dt className="text-xs font-medium text-gray-500">
                    {prettyLabel(key)}
                  </dt>
                  <dd className="break-words text-gray-900">
                    {formatValue(user[key])}
                  </dd>
                </div>
              ))}
          </dl>

          {(user.NIDFront || user.NIDBack) && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-gray-500">ID card</p>
              <div className="flex flex-wrap gap-3">
                {[user.NIDFront, user.NIDBack].filter(Boolean).map((src) => (
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
  );
}
