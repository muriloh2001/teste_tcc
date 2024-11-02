const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Importa a nova rota

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json('Bem-vindo ao app');
});

app.use('/user', userRoutes);
app.use('/company', companyRoutes);
app.use('/job', jobRoutes); // Define o endpoint para as rotas de job

app.listen(PORT, () => console.log('Servidor rodando na porta ' + PORT));
