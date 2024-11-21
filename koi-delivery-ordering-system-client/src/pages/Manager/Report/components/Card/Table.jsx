import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

const Table = ({ headers, data }) => {
  return (
    <TableContainer component={Paper}>
      <MuiTable>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} align="left">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {header}
                  <div
                    style={{
                      marginLeft: "5px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <IconButton size="small">
                      <ArrowUp style={{ width: "16px", height: "16px" }} />
                    </IconButton>
                    <IconButton size="small">
                      <ArrowDown style={{ width: "16px", height: "16px" }} />
                    </IconButton>
                  </div>
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>


        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} hover>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} align="left">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
