import { useState } from "react";
import toast from "react-hot-toast";
import { Button, Modal, Tooltip } from "antd";
import { Expand, UserX } from "lucide-react";
import {
  useBlockUsersMutation,
  useGetAllProvidersQuery,
  useSingleUsersQuery,
} from "../../redux/feature/userManagement/userManagementApi";
import {
  BlockedBadge,
  CardList,
  KitTable,
  PageHeader,
  PagerBar,
  PersonCell,
  RoleBadge,
  SearchBox,
  UserOverviewModal,
  formatDate,
} from "../../component/common/TableKit";

const DATA_LIMIT = 10;

const AllProvider = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [overviewId, setOverviewId] = useState("");
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [blockTarget, setBlockTarget] = useState(null);

  const { data, isLoading, isFetching, refetch } = useGetAllProvidersQuery({
    limit: DATA_LIMIT,
    page,
  });
  const { data: singleUser, isFetching: isOverviewLoading } =
    useSingleUsersQuery(overviewId, {
      skip: !overviewId,
      refetchOnMountOrArgChange: true,
    });
  const [blockUser, { isLoading: isBlocking }] = useBlockUsersMutation();

  const total = data?.meta?.total || 0;
  const providers = (data?.data || []).filter((user) => {
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
        <div className="flex flex-col items-start gap-1">
          <PersonCell name={text} image={record.profilePicture} />
          <BlockedBadge user={record} />
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

  const emptyText = searchText
    ? "No providers match your search."
    : "No providers yet.";

  return (
    <div className="mx-auto w-full max-w-7xl font-title">
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <PageHeader
          title="All Providers Details"
          subtitle={
            isLoading
              ? "Loading providers..."
              : `${total} ${total === 1 ? "provider" : "providers"} in total`
          }
        >
          <SearchBox
            value={searchText}
            onChange={setSearchText}
            placeholder="Search name, email or phone"
          />
        </PageHeader>

        <div className="hidden md:block">
          <KitTable
            columns={columns}
            data={providers}
            loading={isFetching}
            emptyText={emptyText}
          />
        </div>

        <div className="md:hidden">
          <CardList
            loading={isLoading}
            fetching={isFetching}
            items={providers}
            emptyText={emptyText}
          >
            {providers.map((user) => (
              <li key={user._id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <PersonCell
                      name={user.userName}
                      image={user.profilePicture}
                      size={44}
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <RoleBadge role={user.role} />
                      <BlockedBadge user={user} />
                    </div>
                    <p className="mt-2 truncate text-sm text-gray-600">
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
          </CardList>
        </div>

        <PagerBar
          page={page}
          total={total}
          pageSize={DATA_LIMIT}
          onChange={setPage}
        />
      </div>

      <UserOverviewModal
        title="Provider overview"
        open={overviewOpen}
        onClose={() => setOverviewOpen(false)}
        user={singleUser?.data}
        loading={isOverviewLoading}
      />

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

export default AllProvider;
