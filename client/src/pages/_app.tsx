import { AppProps } from "next/app";
import axios from "axios";
import "../styles/tailwind.css";
import { store, StoreContext } from "../app/stores/store";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : (
        <StoreContext.Provider value={store}>
          <BrowserRouter>
            <Component {...pageProps} />
          </BrowserRouter>
        </StoreContext.Provider>
      )}
    </div>
  );
}

export default App;
