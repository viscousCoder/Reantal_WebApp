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
