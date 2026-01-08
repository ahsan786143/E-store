"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";

import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreIcon from "@mui/icons-material/Restore";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

import { Tooltip } from "../ui/tooltip";
import ButtonLoading from "../ButtonLoading/ButtonLoading";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { showToast } from "@/lib/showToast";
import { download, generateCsv, mkConfig,  } from "export-to-csv";
import { IconButton } from "@mui/material";

const Datatable = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndPoint,
  deleteEndPoint,
  deleteType,
  trashView,
  createAction,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  // Delete Hook
  const deleteMutation = useDeleteMutation(deleteEndPoint, queryKey);

  const handleDelete = (ids, type) => {
    let confirmDelete = true;

    if (type === "PD") {
      confirmDelete = confirm("Are you sure you want to permanently delete?");
    } else if (type === "RESTORE") {
      confirmDelete = confirm("Restore selected items?");
    } else {
      confirmDelete = confirm("Move selected items to trash?");
    }

    if (confirmDelete) {
      deleteMutation.mutate({ ids, deleteType: type });
      setRowSelection({});
    }
  };

  // Export CSV
 const handleExport = async (selectedRows) => {
  setExportLoading(true);

  try {
    const csvConfig = mkConfig({
      filename: "export-data",
      useKeysAsHeaders: true,
      decimalSeparator: ".",
      fieldSeparator: ",",
    });
    let csv;

    if (Object.keys(rowSelection).length > 0) {
      const rowData = selectedRows.map((row) => row.original);
      csv = generateCsv(csvConfig)(rowData);
    } else{
      const {data: response}= await axios.get(exportEndPoint);
      if(!response.success){
        throw new Error(response.message)
      }
       const rowData = response.data;
       csv = generateCsv(csvConfig)(rowData);
    }

    download(csvConfig)(csv);
  } catch (err) {
    showToast("error", err.message);
  } finally {
    setExportLoading(false);
  }
};
// useEffect(() => {
//   console.log("Row Selection:", rowSelection);
// }, [rowSelection]);



  // Fetch Data
  const {
    data: { data = [], meta } = {},
    isError,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: [
      queryKey,
      { columnFilters, globalFilter, sorting, pagination },
    ],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);

      url.searchParams.set(
        "start",
        pagination.pageIndex * pagination.pageSize
      );
      url.searchParams.set("size", pagination.pageSize);
      url.searchParams.set("filter", JSON.stringify(columnFilters));
      url.searchParams.set("globalFilter", globalFilter);
      url.searchParams.set("sorting", JSON.stringify(sorting));
      url.searchParams.set("deleteType", deleteType);

      const { data: response } = await axios.get(url.href);
      return response;
    },
    placeholderData: keepPreviousData,
  });

  // Material React Table Instance
  const table = useMaterialReactTable({
    columns: Array.isArray(columnsConfig) ? columnsConfig : [],
    data,

    enableRowSelection: true,
    positionSelectionColumn: "first",
    positionActionsColumn: "last",
    enableRowActions: true,
    enableStickyHeader: true,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,

    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",

    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,

    rowCount: meta?.totalRowCount ?? 0,

    state: {
      columnFilters,
      globalFilter,
      sorting,
      pagination,
      rowSelection,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },

getRowId: (row) => row._id,

    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,

    // Top Right Buttons
    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {/* Go To Trash */}
        {deleteType !== "PD" && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {/* Soft Delete */}
        {deleteType === "SD" && (
          <Tooltip title="Delete Selected">
            <IconButton
              disabled={table.getIsSomeRowsSelected()}
              onClick={() =>
                handleDelete(Object.keys(rowSelection), deleteType)
              }
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Restore & Permanent Delete */}
        {deleteType === "PD" && (
          <>
            {/* Restore */}
            <Tooltip title="Restore Selected">
              <IconButton
                disabled={table.getIsSomeRowsSelected()}
                onClick={() =>
                  handleDelete(Object.keys(rowSelection), "RESTORE")
                }
              >
                <RestoreIcon />
              </IconButton>
            </Tooltip>

            {/* Permanent Delete */}
            <Tooltip title="Permanently Delete">
              <IconButton
                disabled={table.getIsSomeRowsSelected()}
                onClick={() =>
                  handleDelete(Object.keys(rowSelection), "PD")
                }
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),

    renderRowActionMenuItems: ({ row }) =>
      createAction(row, deleteType, handleDelete),

    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip>
        <ButtonLoading
          type="button"
          text={
            <>
              <SaveAltIcon fontSize="25" /> Export
            </>
          }
          loading={exportLoading}
          onClick={() =>
            handleExport(table.getSelectedRowModel().rows)
          }
          className="cursor-pointer"
        />
      </Tooltip>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default Datatable;
