import "@/globals.css";

import { Provider } from "react-redux";
import store from "@/redux/store/index";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import theme from "@/utils/theme"; // optional custom theme
import ThemeRegistry from "@/components/calendar/utils/style";

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
    
      <ThemeRegistry>

        <Component {...pageProps} />
      </ThemeRegistry>
        
   
    </Provider>
  );
}
