import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import AccountDetails from "./pages/AccountDetails.tsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/create-account"
          element={<CreateAccount />}
        />

        <Route
          path="/account/:id"
          element={<AccountDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;