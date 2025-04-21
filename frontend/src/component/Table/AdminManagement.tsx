import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import TenantTable from "./TenantTable";
import OwnerTable from "./OwnerTable";
import AdminTable from "./AdminTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchUsersByType } from "../../store/adminSlice";
import Loading from "../Loading/Loading";

const AdminManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, updateLoading } = useSelector(
    (state: RootState) => state.admin
  );
  const [activeTab, setActiveTab] = useState<"tenant" | "owner" | "admin">(
    "tenant"
  );
  const [toggle, setToggle] = useState(false);

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "tenant" | "owner" | "admin"
  ) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    dispatch(fetchUsersByType(activeTab));
  }, [activeTab, toggle]);

  return (
    <>
      {loading || updateLoading ? (
        <Loading />
      ) : (
        <Box>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Tenant Management" value="tenant" />
            <Tab label="Property Owner Management" value="owner" />
            <Tab label="Admin Management" value="admin" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            {activeTab === "tenant" && <TenantTable setToggle={setToggle} />}
            {activeTab === "owner" && <OwnerTable setToggle={setToggle} />}
            {activeTab === "admin" && <AdminTable />}
          </Box>
        </Box>
      )}
    </>
  );
};

export default AdminManagement;
