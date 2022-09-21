import express from 'express';
import cors from 'cors';
const app = express();
import { PrismaClient } from '@prisma/client';
import { v4 as uuid} from 'uuid';


app.use(cors('*'));
app.use(express.json());
const prisma = new PrismaClient();

app.get('/', async function(req, res) {
    
    
    res.send('1');
});

app.post('/signUp/', async function(req, res){

    const user = String(req.body.username);
    const password = String(req.body.password);
    const email = String(req.body.email);
    try {
         await prisma.User.create({
            data: {
                username: user,
                password: password,
                email: email

            }
        });
        res.send('deu certo');
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
    
  
})

app.post('/auth', async function(req, res) {
    const { username, password } = req.body;
    

    // try {
        const user = await prisma.user.findUnique({ 
            where: { username: username }
        });
        ;
        if (user.password === password) {
            const userId = user.id;
            const token = uuid();
            
            await prisma.user.update({
                where: { 
                    username: username 
                },
                data: {
                    token: token
                }
            });
            const exist = true
            res.send({ token, userId, exist });
            res.status(200);
            console.log('User logged in');
            
        } else {
            const exist = false
            res.send(exist);
            res.status(401);
            console.log('Wrong password');
        } 
    // }
    // catch (e) {
    //     res.send('User not found');
    // }

});

app.post('/getUser', async function(req, res) {
    const { token } = req.body;
    const user = await prisma.user.findMany({
        where: {
            token: token
        }
    });
    
    res.send(user);
    res.status(200);

});

app.get('/getUsers', async function(req, res) {
    const users = await prisma.user.findMany();
    
    res.send(users);   
    res.status(200);
});

app.post('/deleteUser', async function(req, res) {
    const id  = parseInt(req.body.id)
    await prisma.user.delete({
        where: {
            id: id
        }

    });
    const users = await prisma.user.findMany();
    res.send(users);
    res.status(200);
});


app.listen(3001);
