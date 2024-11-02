const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { getUserCollection } = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function signupUser(req, res) {
    const { email, password } = req.body
    const generatedUserId = uuidv4()
    const sanitizedEmail = email.toLowerCase()
    const hashedpassword = await bcrypt.hash(password, 10)
    const users = await getUserCollection()

    const existingUser = await users.findOne({ email })
    if (existingUser) return res.status(409).send('E-mail já cadastrado')

    const data = {
        user_id: generatedUserId,
        email: sanitizedEmail,
        hashed_password: hashedpassword
    }

    const insertedUser = await users.insertOne(data)

    const token = jwt.sign(insertedUser, sanitizedEmail, {
        expiresIn: 60 * 24,
    })

    return res.status(201).json({ token, userId: generatedUserId })
}

async function loginUser(req, res) {
    const { email, password } = req.body
    const users = await getUserCollection()

    const user = await users.findOne({ email })
    const correctPassword = await bcrypt.compare(password, user.hashed_password)

    if (user && correctPassword) {
        const token = jwt.sign(user, email, {
            expiresIn: 60 * 24
        })
        return res.status(201).json({ token, userId: user.user_id })
    }
    return res.status(400).send('Credenciais inválidas')

}


// async function getUser(req, res) {
//     const users = await getUserCollection()

//     const userId = JSON.parse(req.query.userIds)

//     const pipeline = [
//         {
//             '$match': {
//                 'user_id': {
//                     '$in': userId
//                 }
//             }
//         }
//     ]

//     const foundUsers = await users.aggregate(pipeline).toArray()
//     res.json(foundUsers)
// }


async function getUser(req, res) {
    const users = await getUserCollection();
    const userId = req.params.userId; // Obtém o userId da URL

    const user = await users.findOne({ user_id: userId }); // Busca o usuário pelo ID

    if (!user) {
        return res.status(404).send('Usuário não encontrado');
    }

    const { hashed_password, ...userData } = user; // Remove a senha dos dados retornados
    res.json(userData); // Retorna os dados do usuário
}


async function putUser(req, res) {
    const users = await getUserCollection()
    const formData = req.body.formData

    const query = { user_id: formData.user_id }
    const habilidades = formData.habilidades || []
    const updateDocument = {
        $set: {
            nome_candidato: formData.nome_candidato,
            cpf_candidato: formData.cpf_candidato,
            endereco_candidato: formData.endereco_candidato,
            n_candidato: formData.n_candidato,
            cidade_candidato: formData.cidade_candidato,
            estado_candidato: formData.estado_candidato,
            pais_candidato: formData.pais_candidato,
            dob_day: formData.dob_day,
            dob_month: formData.dob_month,
            dob_year: formData.dob_year,
            gender_identity: formData.gender_identity,
            telefone_candidato: formData.telefone_candidato,
            // email_candidato: formData.email_candidato,
            about_candidato: formData.about_candidato,
            linkedin_candidato: formData.linkedin_candidato,
            links_candidato: formData.links_candidato,
            nivel_escolaridade_candidato: formData.nivel_escolaridade_candidato,
            curso_candidato: formData.curso_candidato,
            instituicao_candidato: formData.instituicao_candidato,
            mes_inicio: formData.mes_inicio,
            ano_inicio: formData.ano_inicio,
            mes_termino: formData.mes_termino,
            ano_termino: formData.ano_termino,
            estado_estudo: formData.estado_estudo,
            habilidades: habilidades,
            // email: req.cookies.Email || formData.email,
            url: formData.url,
            about: formData.about,
            matches: formData.matches
        },
    }
    const insertedUser = await users.updateOne(query, updateDocument)
    res.send(insertedUser)

}


module.exports = { signupUser, loginUser, getUser, putUser }



// A implementar


// app.put('/addmatch', async (req, res) => {
//     const client = new MongoClient(uri)
//     const { userId, matchedUserId } = req.body

//     try {
//         await client.connect()
//         const database = client.db('app-data')
//         const users = database.collection('users')

//         const query = { user_id: userId }
//         const updateDocument = {
//             $push: { matches: { user_id: matchedUserId } }
//         }
//         const user = await users.updateOne(query, updateDocument)
//         res.send(user)
//     } finally {
//         await client.close()
//     }
// })



// app.get('/messages', async (req, res) => {
//     const client = new MongoClient(uri)
//     const { userId, correspondingUserId } = req.query



//     try {
//         await client.connect()
//         const database = client.db('app-data')
//         const messages = database.collection('messages')

//         const query = {
//             from_userid: userId, to_userId: correspondingUserId
//         }
//         const foundMessages = await messages.find(query).toArray()
//         res.send(foundMessages)

//     } finally {
//         await client.close()
//     }

// })





// app.post('/message', async (req, res) => {
//     const client = new MongoClient(uri)
//     const message = req.body.message

//     try {
//         await client.connect()
//         const database = client.db('app-data')
//         const messages = database.collection('messages')

//         const insertedMessage = await messages.insertOne(message)
//         res.send(insertedMessage)
//     } finally {
//         await client.close()
//     }
// })



