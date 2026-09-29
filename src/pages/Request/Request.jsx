import { useState } from "react";
import { useGetAllBookingQuery } from "../../redux/feature/userManagement/userManagementApi";
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
} from "../../component/common/TableKit";

const DATA_LIMIT = 10;

const Request = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, isFetching } = useGetAllBookingQuery({
    limit: DATA_LIMIT,
    page,
  });

  const total = data?.meta?.total || 0;

  // Search current page: owner ba provider er nam diye
  const bookings = (data?.data || []).filter((booking) => {
    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    return (
      booking.ownerName?.toLowerCase().includes(q) ||
      booking.providerName?.toLowerCase().includes(q)
    );
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
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: formatDate,
    },
    {
      title: "Service Duration",
      dataIndex: "serviceDuration",
      key: "duration",
      render: (t) => t || "-",
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
    ? "No bookings match your search."
    : "No bookings yet.";

  return (
    <div className="mx-auto w-full max-w-7xl font-title">
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <PageHeader
          title="Request Overview"
          subtitle={
            isLoading
              ? "Loading bookings..."
              : `${total} ${total === 1 ? "booking" : "bookings"} in total`
          }
        >
          <SearchBox
            value={searchText}
            onChange={setSearchText}
            placeholder="Search owner or provider"
          />
        </PageHeader>

        <div className="hidden md:block">
          <KitTable
            columns={columns}
            data={bookings}
            loading={isFetching}
            emptyText={emptyText}
          />
        </div>

        <div className="md:hidden">
          <CardList
            loading={isLoading}
            fetching={isFetching}
            items={bookings}
            emptyText={emptyText}
          >
            {bookings.map((booking) => (
              <li key={booking.id || booking._id} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={booking.status} />
                  <span className="text-lg font-semibold text-gray-900">
                    {formatMoney(booking.amount)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-gray-500">Owner</p>
                    <PersonCell
                      name={booking.ownerName}
                      image={booking.ownerProfilePicture}
                      size={32}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-gray-500">Provider</p>
                    <PersonCell
                      name={booking.providerName}
                      image={booking.providerProfilePicture}
                      size={32}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500">
                  <span>Booked {formatDate(booking.bookingDate)}</span>
                  <span>{booking.serviceDuration || "-"}</span>
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
    </div>
  );
};

export default Request;
