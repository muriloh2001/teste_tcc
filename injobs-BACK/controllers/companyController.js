const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { getCompanyCollection } = require('../models/companyModel');
const jwt = require('jsonwebtoken');

async function signupCompany(req, res) {
    const { email, password } = req.body
    const generatedCompanyId = uuidv4()
    const sanitizedEmail = email.toLowerCase()
    const hashedpassword = await bcrypt.hash(password, 10)
    const companies = await getCompanyCollection()

    const existingCompany = await companies.findOne({ email })
    if (existingCompany) return res.status(409).send('E-mail já cadastrado')

    const data = {
        company_id: generatedCompanyId,
        email: sanitizedEmail,
        hashed_password: hashedpassword
    }

    const insertedCompany = await companies.insertOne(data)

    const token = jwt.sign(insertedCompany, sanitizedEmail, {
        expiresIn: 60 * 24,
    })

    return res.status(201).json({ token, companyId: generatedCompanyId })
}

async function loginCompany(req, res) {
    const { email, password } = req.body
    const companies = await getCompanyCollection()

    const company = await companies.findOne({ email })
    const correctPassword = await bcrypt.compare(password, company.hashed_password)

    if (company && correctPassword) {
        const token = jwt.sign(company, email, {
            expiresIn: 60 * 24
        })
        return res.status(201).json({ token, companyId: company.company_id })
    }
    return res.status(400).send('Credenciais inválidas')
}


async function getCompany(req, res) {
    const companies = await getCompanyCollection();
    const companyId = req.params.companyId; // Obtém o companyId da URL

    const company = await companies.findOne({ company_id: companyId }); // Busca o usuário pelo ID

    if (!company) {
        return res.status(404).send('Empresa não encontrada');
    }

    const { hashed_password, ...companyData } = company; // Remove a senha dos dados retornados
    res.json(companyData); // Retorna os dados do usuário
}



async function createVacancy(req, res) {
    const companies = await getCompanyCollection()
    const formData = req.body.formData

    const newVacancy = formData.vaga
    const query = { company_id: newVacancy.company_id }

    const updateDocument = {
        $push: {
            vagas: newVacancy
        }
    }
    const insertedCompany = await companies.updateOne(query, updateDocument)
    res.send(insertedCompany)
}


async function putCompany(req, res) {
    console.log(req.body); // Verifique o conteúdo

    const companies = await getCompanyCollection();
    const { company_id, ...updatedData } = req.body; // Extraímos company_id e o resto dos dados

    // Remover o campo '_id' de updatedData, se presente
    if (updatedData._id) {
        delete updatedData._id;
    }

    const query = { company_id };
    const updateDocument = {
        $set: {
            ...updatedData,
            email: req.cookies.Email || updatedData.email // Mantém a lógica do email
        }
    };

    try {
        const result = await companies.updateOne(query, updateDocument);
        if (result.matchedCount === 0) {
            return res.status(404).send('Empresa não encontrada');
        }
        res.send(result);
    } catch (error) {
        console.error('Erro ao atualizar a empresa:', error);
        res.status(500).send('Erro interno do servidor');
    }
}

module.exports = { signupCompany, loginCompany, getCompany, createVacancy, putCompany }