import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { User } from "../../types/Admin";
import Loading from "../Loading/Loading";
import { deleteUser, updateUserBlockStatus } from "../../store/adminSlice";
import { useNavigate } from "react-router-dom";

interface TenantTableProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const TenantTable: React.FC<TenantTableProps> = ({ setToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    users: dummyTenants,
    updateLoading,
  } = useSelector((state: RootState) => state.admin);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<User | null>(null);
  const navigate = useNavigate();

  const filteredTenants = dummyTenants
    .filter((tenant): tenant is User => "bookings" in tenant)
    .filter(
      (tenant) =>
        tenant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.phoneNumber.includes(searchQuery)
    );

  const paginatedTenants: User[] = filteredTenants.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleViewClick = (tenant: User) => {
    setSelectedTenant(tenant);
    setViewDialogOpen(true);
  };

  const handleEditClick = (tenant: User) => {
    setSelectedTenant(tenant);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (tenant: User) => {
    setSelectedTenant(tenant);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async () => {
    // API call to update tenant

    await dispatch(
      updateUserBlockStatus({
        userId: selectedTenant?.id || "",
        userRole: "tenant",
        block: selectedTenant?.block ?? false,
      })
    );
    setEditDialogOpen(false);
    setToggle((prev) => !prev);
  };

  const handleDeleteConfirm = async () => {
    // API call to delete tenant
    await dispatch(
      deleteUser({ userId: selectedTenant?.id || "", userRole: "tenant" })
    );

    setDeleteDialogOpen(false);
    setToggle((prev) => !prev);
  };

  const handleClick = (tenant: User) => {
    localStorage.setItem("selectedUserId", tenant.id);
    localStorage.setItem("selectedUserRole", "tenant");
    navigate("/admin/tenantProfile");
  };

  return (
    <>
      {loading || updateLoading ? (
        <Loading />
      ) : (
        <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Tenant Management
          </Typography>

          <TextField
            fullWidth
            placeholder="Search tenants by name, email, or contact..."
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
                  <TableCell>Contact No.</TableCell>
                  <TableCell>No. of Bookings</TableCell>
                  <TableCell>Joining Date</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Blocked</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Full Profile</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTenants?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No tenants found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTenants?.map((tenant) => (
                    <TableRow
                      key={tenant.id}
                      // onClick={() => console.log("hii")}
                    >
                      <TableCell>{tenant.id}</TableCell>
                      <TableCell>{tenant.fullName}</TableCell>
                      <TableCell>{tenant.email}</TableCell>
                      <TableCell>{tenant.phoneNumber}</TableCell>
                      <TableCell>{tenant?.bookings?.length}</TableCell>
                      <TableCell>{tenant.created_at}</TableCell>
                      <TableCell>{tenant.userRole}</TableCell>
                      <TableCell>{tenant.block ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleViewClick(tenant)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(tenant)}
                          color="secondary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(tenant)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleClick(tenant)}
                        >
                          Profile
                        </Button>
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
              count={Math.ceil(filteredTenants.length / rowsPerPage)}
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
            <DialogTitle>User Info</DialogTitle>
            <DialogContent>
              {selectedTenant && (
                <Box sx={{ minWidth: 400 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>ID:</strong> {selectedTenant.id}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Full Name:</strong> {selectedTenant.fullName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {selectedTenant.email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Contact No.:</strong> {selectedTenant.phoneNumber}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>No. of Bookings:</strong>{" "}
                    {selectedTenant.bookings?.length}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Joining Date:</strong> {selectedTenant.created_at}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Role:</strong> {selectedTenant.userRole}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Blocked:</strong>{" "}
                    {selectedTenant.block ? "Yes" : "No"}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
          >
            <DialogTitle>Edit Tenant Status</DialogTitle>
            <DialogContent>
              {selectedTenant && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Blocked Status</InputLabel>
                  <Select
                    value={selectedTenant.block ? "true" : "false"}
                    onChange={(e) =>
                      setSelectedTenant({
                        ...selectedTenant,
                        block: e.target.value === "true",
                      })
                    }
                    label="Blocked Status"
                  >
                    <MenuItem value="false">Active</MenuItem>
                    <MenuItem value="true">Blocked</MenuItem>
                  </Select>
                </FormControl>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleEditSave}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>
              Deleting {selectedTenant?.fullName} (ID: {selectedTenant?.id})
            </DialogTitle>
            <DialogContent>
              <Typography>
                Delete user permanently from your database. This action cannot
                be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default TenantTable;
