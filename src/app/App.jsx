import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/layout/Header/Header.jsx";

import Teams from "../features/teams/Teams.jsx";
import Standings from "../features/standings/Standings.jsx";
import Stadiums from "../features/stadiums/Stadiums.jsx";
import Matches from "../features/matches/Matches.jsx";
import Prediction from "../features/prediction/Prediction.jsx";
import Auth from "../features/auth/Auth.jsx";

import supabase from "../utils/supabase.js";

import "./App.css";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
      });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Prediction />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/stadiums" element={<Stadiums />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/prediction" element={<Prediction />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
