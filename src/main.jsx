import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer />
        <ConfigProvider>
          <Toaster />
          <RouterProvider router={router} />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
