import React from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import OnCadasterJob from './pages/OnCadasterJob';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OnBoardingEmpresa from './pages/OnboardingEmpresa';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['user']);
  const authToken = cookies.AuthToken; // Capturando o token de autenticação dos cookies

  return (
    <BrowserRouter>         
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Apenas renderiza a rota do Dashboard se o token de autenticação estiver presente */}
        {authToken ? (
          <Route path="/dashboard" element={<Dashboard userType={cookies.userType} />} />
        ) : (
          <Route path="/dashboard" element={<Home />} /> // Redirecionar para Home se não autenticado
        )}
        <Route path="/onBoarding" element={<Onboarding />} />
        <Route path="/onBoardingEmpresa" element={<OnBoardingEmpresa />} />
        <Route path="/OnCadasterJob" element={<OnCadasterJob />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
