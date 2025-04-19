import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { Owner } from "../../types/Admin";
import Loading from "../Loading/Loading";

const AdminTable: React.FC = () => {
  const { loading, users: dummyAdmins } = useSelector(
    (state: RootState) => state.admin
  );

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Owner | null>(null);

  const filteredAdmins = dummyAdmins.filter(
    (admin): admin is Owner =>
      "fullName" in admin &&
      "email" in admin &&
      (admin.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedAdmins: Owner[] = filteredAdmins.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleViewClick = (admin: Owner) => {
    setSelectedAdmin(admin);
    setViewDialogOpen(true);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Owner Management
          </Typography>

          <TextField
            fullWidth
            placeholder="Search admins by name or email..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Joining Date</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Blocked</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAdmins?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No admins found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAdmins?.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.id}</TableCell>
                      <TableCell>{admin.fullName}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.created_at}</TableCell>
                      <TableCell>{admin.userRole}</TableCell>
                      <TableCell>{admin.block ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            handleViewClick(admin);
                          }}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                label="Rows per page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
              </Select>
            </FormControl>
            <Pagination
              count={Math.ceil(filteredAdmins.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>

          {/* View Dialog */}
          <Dialog
            open={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
          >
            <DialogTitle>Admin Info</DialogTitle>
            <DialogContent>
              {selectedAdmin && (
                <Box sx={{ minWidth: 400 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>ID:</strong> {selectedAdmin.id}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Full Name:</strong> {selectedAdmin.fullName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {selectedAdmin.email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Joining Date:</strong> {selectedAdmin.created_at}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Role:</strong> {selectedAdmin.userRole}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Blocked:</strong>{" "}
                    {selectedAdmin.block ? "Yes" : "No"}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default AdminTable;
