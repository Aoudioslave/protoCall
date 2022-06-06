import { ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./pages/App";
import { apollo } from "./apollo";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apollo}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

