import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import UserManagement from "../pages/UserManagement/UserManagement";
import AllOwner from "../pages/AllOwner/AllOwner";
import AllProvider from "../pages/AllProviders/AllProviders";
import Request from "../pages/Request/Request";
import TransactionHistory from "../pages/TransactionHistory/TransactionHistory";
import AllCategory from "../pages/AllCategory/AllCategory";
import PaymentTrack from "../pages/PaymentTrack/PaymentTrack";
import AccountSuspention from "../pages/AccountSuspention/AccountSuspention";
import Refferal from "../pages/Refferal/Refferal";
import ProfileStatus from "../pages/ProfileStatus/ProfileStatus";
import Profile from "../pages/Profile/Profile";
import About from "../pages/About/About";
import Privacy from "../pages/Privacy/Privacy";
import Terms from "../pages/Terms/Terms";
import Login from "../pages/Login/Login";
import Otp from "../pages/Otp/Otp";
import ForgotPass from "../pages/ForgotPass/ForgotPass";
import SetPass from "../pages/SetPass/SetPass";
import KnowledgeHub from "../pages/KnowledgeHub/KnowledgeHub";
import PrivetRoutes from "./PrivetRoute";
import Affiliate from "../pages/Affiliate/Affiliate";





const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Otp />,
  },
//   {
//     path: "/passReset",
//     element: <PassReset />,
//   },
  {
    path: "/forgotPass",
    element: <ForgotPass />,
  },
  {
    path: "/setPass",
    element: <SetPass />,
  },
  {
    path: "/",
    element: <PrivetRoutes><Main></Main></PrivetRoutes>,
    // element:<Main></Main>,
    // errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <DashboardPage/>,
      },
      {
        path: "/userManagement",
        element: <UserManagement />,
      },
      {
        path: "/allOwner",
        element: <AllOwner/>,
      },
      {
        path: "/allProviders",
        element: <AllProvider/>,
      },
      {
        path: "/requestOverview",
        element: <Request/>,
      },
      {
        path: "/transactionHistory",
        element: <TransactionHistory/>,
      },
      {
        path: "/allCategory",
        element: <AllCategory/>,
      },
      {
        path: "/paymentTracking",
        element: <PaymentTrack/>,
      },
      {
        path: "/accountSuspension",
        element: <AccountSuspention/>,
      },
      // {
      //   path: "/referralProgram",
      //   element: <Refferal/>,
      // },
      {
        path: "/profileStatus",
        element: <ProfileStatus/>,
      },
      {
        path: "/knowledge",
        element: <KnowledgeHub/>,
      },
      {
        path: "/setting/updateProfile",
        element: <Profile/>,
      },
      {
        path: "/setting/about",
        element: <About/>,
      },
      {
        path: "/setting/privacy",
        element: <Privacy/>,
      },
      {
        path: "/setting/terms",
        element: <Terms/>,
      }
      // {
      //   path: "/setting/affiliate",
      //   element: <Affiliate/>,
      // },
     
    ],
  },
]);
export default router;
