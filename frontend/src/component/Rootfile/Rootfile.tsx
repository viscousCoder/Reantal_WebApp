import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Layout from "../Layout/Layout";
import RoleSelection from "../Signup/RoleSelection";
import TenantSignup from "../Signup/TenantSignup";
import OwnerSignup from "../Signup/OwnerSignup";
import Login from "../Login/Login";
import Layout from "../Layout/Layout";
import Home from "../HomePage/Home";
import { checkAuthLoader } from "../utils/checkAuth";
import PropertyListing from "../PropertyListing/PropertyListing";
import RoomDetails from "../RoomDetail/RoomDetail";
import Form from "../Payment/Form";
import Success from "../Payment/Success";
import Cancel from "../Payment/Cancel";
import BookedRooms from "../Booked/Booked";
import ListedProperties from "../ListedProperty/ListedProperty";
// import AdminTable from "../Table/AdminManagement";
import AdminManagement from "../Table/AdminManagement";
import Profile from "../Profile/Profile";
import AdminProfile from "../Table/AdminProfile";
import ForgotPassword from "../Password/ForgotPassword";
import UpdatePassword from "../Password/UpdatePassword";
import CreatePassword from "../Password/CreatePassword";

function Rootfile() {
  const router = createBrowserRouter([
    {
      path: "/signup",
      element: <RoleSelection />,
      children: [],
    },
    {
      path: "/tenant-signup",
      element: <TenantSignup />,
      //   loader: checkAuthLoader,
    },
    {
      path: "/owner-signup",
      element: <OwnerSignup />,
      //   loader: checkAuthLoader,
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <CreatePassword />,
    },
    {
      path: "/",
      element: <Layout />,
      loader: checkAuthLoader,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/add",
          element: <PropertyListing />,
        },
        {
          path: "/room-detail/:propertyId",
          element: <RoomDetails />,
        },
        {
          path: "/payemntform",
          element: <Form />,
        },
        {
          path: "/success",
          element: <Success />,
        },
        {
          path: "/cancel",
          element: <Cancel />,
        },
        {
          path: "/booked",
          element: <BookedRooms />,
        },
        {
          path: "/booked/:propertyId",
          element: <RoomDetails />,
        },
        {
          path: "/listedProperty",
          element: <ListedProperties />,
        },
        {
          path: "/listed/:propertyId",
          element: <RoomDetails />,
        },
        {
          path: "/adminTable",
          element: <AdminManagement />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/property/:propertyId",
          element: <RoomDetails />,
        },
        {
          path: "/admin/tenantProfile",
          element: <AdminProfile />,
        },

        {
          path: "/update-password",
          element: <UpdatePassword />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default Rootfile;
