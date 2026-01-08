"use client";

import { useEffect, useState } from "react";
import Datatable from "./Datatable";
import { darkTheme, lightTheme } from "@/lib/materialTheme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTheme } from "next-themes";

const DatatableWrapper = ({
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Choose MUI theme based on resolvedTheme
  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <Datatable
        queryKey={queryKey}
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        initialPageSize={initialPageSize}
        exportEndPoint={exportEndPoint}
        deleteEndPoint={deleteEndPoint}
        deleteType={deleteType}
        trashView={trashView}
        createAction={createAction}
      />
    </MuiThemeProvider>
  );
};

export default DatatableWrapper;
