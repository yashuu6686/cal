import "@/globals.css";

import { Provider } from "react-redux";
import store from "@/redux/store/index";

// import { CssBaseline, ThemeProvider } from "@mui/material";
// import theme from "@/utils/theme"; // optional custom theme
import ThemeRegistry from "@/components/calendar/utils/style";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeRegistry>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </ThemeRegistry>
    </Provider>
  );
}
