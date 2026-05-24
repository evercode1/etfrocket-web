import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { deleteUser, listUsers, searchUsers } from "../../../api/adminUsers";

import DataTable from "../../../components/tables/DataTable";
import Pagination from "../../../components/tables/Pagination";

export default function ListUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sortBy, setSortBy] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function loadUsers(
    page = 1,
    search = activeSearch,
    currentSortBy = sortBy,
    currentSortOrder = sortOrder,
  ) {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        sortBy: currentSortBy,
        sortOrder: currentSortOrder,
      };

      const response = search
        ? await searchUsers(search, params)
        : await listUsers(params);

      setUsers(response.users.data);
      setMeta(response.users);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();

    setActiveSearch(keyword);

    await loadUsers(1, keyword);
  }

  async function handleClearSearch() {
    setKeyword("");
    setActiveSearch("");

    await loadUsers(1, "");
  }

  async function handleSort(columnSortIndex) {
    const nextSortOrder =
      sortBy === columnSortIndex && sortOrder === "asc" ? "desc" : "asc";

    setSortBy(columnSortIndex);
    setSortOrder(nextSortOrder);

    await loadUsers(1, activeSearch, columnSortIndex, nextSortOrder);
  }

  async function handleDelete(user) {
    if (!confirm(`Delete user ${user.email}?`)) {
      return;
    }

    try {
      const response = await deleteUser(user.id);

      setMessage(response.message || "User deleted.");

      await loadUsers(meta?.current_page || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user.");
    }
  }

  const columns = [
    {
      key: "id",
      label: "ID",
      sortIndex: 1,
    },
    {
      key: "name",
      label: "Name",
      sortIndex: 2,
    },
    {
      key: "email",
      label: "Email",
      sortIndex: 3,
    },
    {
      key: "is_admin",
      label: "Admin",
      sortIndex: 4,
      render: (row) => (row.is_admin ? "Yes" : "No"),
    },
    {
      key: "is_active",
      label: "Active",
      sortIndex: 5,
      render: (row) => (row.is_active ? "Yes" : "No"),
    },
    {
      key: "is_subscriber",
      label: "Subscriber",
      sortIndex: 6,
      render: (row) => (row.is_subscriber ? "Yes" : "No"),
    },
    {
      key: "is_influencer",
      label: "Influencer",
      sortIndex: 7,
      render: (row) => (row.is_influencer ? "Yes" : "No"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-3">
          <Link
            to={`/admin/users/${row.id}`}
            className="text-brand-primary hover:underline"
          >
            View
          </Link>

          <Link
            to={`/admin/users/${row.id}/edit`}
            className="text-brand-secondary hover:underline"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="text-brand-danger hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          User Management
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">Manage Users</h1>
      </div>

      {message && (
        <div className="rounded-xl border border-brand-primary/40 bg-brand-primary/10 px-4 py-3 text-sm text-brand-primary">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSearch}
        className="glass-card flex flex-col gap-3 rounded-3xl p-4 md:flex-row"
      >
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
        />

        <button type="submit" className="rocket-button-primary">
          Search
        </button>

        <button
          type="button"
          onClick={handleClearSearch}
          className="rocket-button-secondary"
        >
          Clear
        </button>
      </form>

      {loading ? (
        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Loading users...
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={users}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <Pagination meta={meta} onPageChange={(page) => loadUsers(page)} />
        </>
      )}
    </div>
  );
}
