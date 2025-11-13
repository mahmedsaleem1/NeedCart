import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "./store/store.js";
import { Provider } from "react-redux";


const persistor = persistStore(store);

const rootElement = document.getElementById("root");
  ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
          <App />
    </PersistGate>
  </Provider>
  );


