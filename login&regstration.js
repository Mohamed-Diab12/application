const express = require('express');
const mysql = require('mysql2/promise');

const app = express()
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "2007",
    database: "application"
});

app.use(express.json())


app.get('/',(req,res) =>{
    res.status(200).send('server is running')
})


app.post('/registration', async(req,res) =>{
    const { email, userPassword, userName} = req.body
    if(!email || !userPassword || !userName){
        res.status(400).send("Name, email and password are required")
        return
    }

    const[users] = await db.execute("select userName from users where email = ?",[email])
    if(users.length > 0){
        res.send("Email already registered")
        return
    }

    if(userPassword.length< 8 || userPassword.length> 70){
        res.send("Password must be 8 to 70 characters")
        return
    }

    const[result] = await db.execute("insert into users(email,userPassword,userName) values (?,?,?)",[ email, userPassword, userName])
    res.send("Registration done!")
})


app.post('/login', async(req,res) =>{
    const { email, userPassword} = req.body
    if(!email || !userPassword){
        res.send("Email and password are required")
        return
    }

    const[users] = await db.execute("select email , userPassword , userName from users where email = ?", [email])
    if(users.length === 0){
        res.send("email or password is wrong")
        return
    }
    
    const user = users[0]
    if(user.userPassword != userPassword){
        res.send("email or password is wrong")
        return    
    }

    res.send("Welcome!")
})


app.get('/users', async(req,res) =>{
    const[users] = await db.execute("select * from users")
    if(users.length === 0){
        res.send("There are no users")
        return
    }
    res.send(users)
})

app.listen(5000,() =>{
    console.log("start port 5000")
})