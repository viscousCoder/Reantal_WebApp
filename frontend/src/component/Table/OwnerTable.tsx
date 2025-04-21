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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Owner } from "../../types/Admin";
import { calculateOwnerStats } from "../utils/ownerStats";
import Loading from "../Loading/Loading";
import { deleteUser, updateUserBlockStatus } from "../../store/adminSlice";
import { useNavigate } from "react-router-dom";

interface TenantTableProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}
const OwnerTable: React.FC<TenantTableProps> = ({ setToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    users: dummyOwners,
    updateLoading,
  } = useSelector((state: RootState) => state.admin);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const navigate = useNavigate();

  const filteredOwners = dummyOwners?.filter(
    (owner) =>
      owner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.phoneNumber.includes(searchQuery)
  );

  const paginatedOwners: Owner[] = filteredOwners
    ?.filter((owner): owner is Owner => "properties" in owner)
    .slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleViewClick = (owner: Owner) => {
    setSelectedOwner(owner);
    setViewDialogOpen(true);
  };

  const handleEditClick = (owner: Owner) => {
    setSelectedOwner(owner);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (owner: Owner) => {
    setSelectedOwner(owner);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = async () => {
    // API call to update owner

    await dispatch(
      updateUserBlockStatus({
        userId: selectedOwner?.id || "",
        userRole: "owner",
        block: selectedOwner?.block ?? false,
      })
    );
    setEditDialogOpen(false);
    setToggle((prev) => !prev);
  };

  const handleDeleteConfirm = async () => {
    // API call to delete owner
    await dispatch(
      deleteUser({ userId: selectedOwner?.id || "", userRole: "owner" })
    );

    setDeleteDialogOpen(false);
    setToggle((prev) => !prev);
  };

  const handleClick = (owner: Owner) => {
    localStorage.setItem("selectedUserId", owner.id);
    localStorage.setItem("selectedUserRole", "owner");
    navigate("/admin/tenantProfile");
  };

  return (
    <>
      {loading || updateLoading ? (
        <Loading />
      ) : (
        <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Property Owner Management
          </Typography>

          <TextField
            fullWidth
            placeholder="Search owners by name, email, or contact..."
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
                  <TableCell>No. of Properties</TableCell>
                  <TableCell>Total Sets</TableCell>
                  <TableCell>Booked Sets</TableCell>
                  <TableCell>Available Sets</TableCell>
                  <TableCell>Joining Date</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Blocked</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Full Profile</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOwners?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      No owners found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOwners?.map((owner) => {
                    const { totalSets, availableSets, bookedSets } =
                      calculateOwnerStats(owner);
                    return (
                      <TableRow key={owner.id}>
                        <TableCell>{owner.id}</TableCell>
                        <TableCell>{owner.fullName}</TableCell>
                        <TableCell>{owner.email}</TableCell>
                        <TableCell>{owner.phoneNumber}</TableCell>
                        <TableCell>{owner.properties?.length ?? 0}</TableCell>
                        <TableCell>{totalSets}</TableCell>
                        <TableCell>{bookedSets}</TableCell>
                        <TableCell>{availableSets}</TableCell>
                        <TableCell>{owner.created_at}</TableCell>
                        <TableCell>{owner.userRole}</TableCell>
                        <TableCell>{owner.block ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleViewClick(owner)}
                            color="primary"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEditClick(owner)}
                            color="secondary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(owner)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleClick(owner)}
                          >
                            Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
              count={Math.ceil(filteredOwners?.length / rowsPerPage)}
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
            <DialogTitle>Owner Info</DialogTitle>
            <DialogContent>
              {selectedOwner && (
                <Box sx={{ minWidth: 400 }}>
                  {(() => {
                    const { totalSets, bookedSets, availableSets } =
                      calculateOwnerStats(selectedOwner);
                    return (
                      <>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>ID:</strong> {selectedOwner.id}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Full Name:</strong> {selectedOwner.fullName}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Email:</strong> {selectedOwner.email}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Contact No.:</strong>{" "}
                          {selectedOwner.phoneNumber}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>No. of Properties:</strong>{" "}
                          {selectedOwner.properties.length}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Total Sets:</strong> {totalSets}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Booked Sets:</strong> {bookedSets}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Available Sets:</strong> {availableSets}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Joining Date:</strong>{" "}
                          {selectedOwner.created_at}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Role:</strong> {selectedOwner.userRole}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Blocked:</strong>{" "}
                          {selectedOwner.block ? "Yes" : "No"}
                        </Typography>
                      </>
                    );
                  })()}
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
            <DialogTitle>Edit Owner Status</DialogTitle>
            <DialogContent>
              {selectedOwner && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Blocked Status</InputLabel>
                  <Select
                    value={selectedOwner.block ? "true" : "false"}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
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
              Deleting {selectedOwner?.fullName} (ID: {selectedOwner?.id})
            </DialogTitle>
            <DialogContent>
              <Typography>
                Delete owner permanently from your database. This action cannot
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

export default OwnerTable;
