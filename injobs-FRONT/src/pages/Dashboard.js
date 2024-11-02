import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ userType }) => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      const companyId = '672539b02e84968cb24acd99'; // ou obter dinamicamente
      const response = await axios.get(`/api/jobs/company/${companyId}`);
      setJobs(response.data); // supondo que a resposta seja um array de vagas
    } catch (error) {
      setError('Erro ao buscar vagas: ' + error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>{error}</p>}
      {jobs.length === 0 ? (
        <p>Não há vagas disponíveis no momento.</p>
      ) : (
        jobs.map((job) => <div key={job.id}>{job.title}</div>)
      )}
    </div>
  );
};

export default Dashboard;
