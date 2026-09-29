import { useState } from "react";
import { useGetAllTransectionsQuery } from "../../redux/feature/userManagement/userManagementApi";
import {
  CardList,
  KitTable,
  PageHeader,
  PagerBar,
  PersonCell,
  SearchBox,
  StatusBadge,
  formatDate,
  formatMoney,
  humanize,
} from "../../component/common/TableKit";

const PAGE_SIZE = 10;

const TransactionHistory = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, isFetching } = useGetAllTransectionsQuery({
    limit: PAGE_SIZE,
    page,
  });

  const total = data?.data?.pagination?.total || 0;

  // Search current page: nam, email ba transaction id diye
  const transactions = (data?.data?.transactions || []).filter((tx) => {
    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    return [
      tx.ownerName,
      tx.providerName,
      tx.ownerEmail,
      tx.providerEmail,
      tx.transactionId,
    ].some((field) => field?.toLowerCase().includes(q));
  });

  const columns = [
    {
      title: "Owner",
      dataIndex: "ownerName",
      key: "owner",
      render: (text, record) => (
        <PersonCell name={text} image={record.ownerProfilePicture} />
      ),
    },
    {
      title: "Provider",
      dataIndex: "providerName",
      key: "provider",
      render: (text, record) => (
        <PersonCell name={text} image={record.providerProfilePicture} />
      ),
    },
    { title: "Date", dataIndex: "createdAt", key: "date", render: formatDate },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "type",
      render: (t) => <span className="capitalize">{humanize(t)}</span>,
    },
    {
      title: "Txn ID",
      dataIndex: "transactionId",
      key: "txnId",
      render: (t) => (
        <span className="block max-w-[180px] truncate" title={t}>
          {t || "-"}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <b>{formatMoney(text)}</b>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  const emptyText = searchText
    ? "No transactions match your search."
    : "No transactions yet.";

  return (
    <div className="mx-auto w-full max-w-7xl font-title">
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <PageHeader
          title="Transaction History"
          subtitle={
            isLoading
              ? "Loading transactions..."
              : `${total} ${total === 1 ? "transaction" : "transactions"} in total`
          }
        >
          <SearchBox
            value={searchText}
            onChange={setSearchText}
            placeholder="Search name, email or Txn ID"
          />
        </PageHeader>

        <div className="hidden md:block">
          <KitTable
            columns={columns}
            data={transactions}
            loading={isFetching}
            emptyText={emptyText}
          />
        </div>

        <div className="md:hidden">
          <CardList
            loading={isLoading}
            fetching={isFetching}
            items={transactions}
            emptyText={emptyText}
          >
            {transactions.map((tx) => (
              <li key={tx.id || tx._id || tx.transactionId} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={tx.status} />
                  <span className="text-lg font-semibold text-gray-900">
                    {formatMoney(tx.amount)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-gray-500">Owner</p>
                    <PersonCell
                      name={tx.ownerName}
                      image={tx.ownerProfilePicture}
                      size={32}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-gray-500">Provider</p>
                    <PersonCell
                      name={tx.providerName}
                      image={tx.providerProfilePicture}
                      size={32}
                    />
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between gap-2">
                    <span className="capitalize">
                      {humanize(tx.transactionType)}
                    </span>
                    <span>{formatDate(tx.createdAt)}</span>
                  </div>
                  <p className="truncate">Txn ID: {tx.transactionId || "-"}</p>
                </div>
              </li>
            ))}
          </CardList>
        </div>

        <PagerBar
          page={page}
          total={total}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      </div>
    </div>
  );
};

export default TransactionHistory;
