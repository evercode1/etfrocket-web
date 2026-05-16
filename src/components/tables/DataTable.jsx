import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

export default function DataTable({
  columns,
  rows,
  emptyMessage = "No records found.",
  sortBy = null,
  sortOrder = "asc",
  onSort = null,
}) {
  function renderSortIcon(column) {
    if (!column.sortIndex) {
      return null;
    }

    if (sortBy !== column.sortIndex) {
      return <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />;
    }

    return sortOrder === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-outline bg-brand-surface/70">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-outline">
          <thead className="bg-brand-surfaceHigh">
            <tr>
              {columns.map((column) => {
                const isSortable = Boolean(column.sortIndex && onSort);

                return (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-brand-primary"
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(column.sortIndex)}
                        className="flex items-center gap-2 transition hover:text-brand-secondary"
                      >
                        {column.label}
                        {renderSortIcon(column)}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-outline">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-brand-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {rows.map((row, index) => (
              <tr
                key={row.id || index}
                className="transition hover:bg-brand-surfaceHighest/60"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-brand-muted"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
