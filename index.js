const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json())
const data = require('./data.json')
const usersdata = require('./users.json')
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('listening to port', port)
})

app.get('/', (req, res) => {
    res.send('working');
})

app.get("/api/allposts", (req, res) => {
    res.send(data);
})

app.post("/api/newpost", (req, res) => {
    let id = 0;
    if (data.posts.length !== 0) {
        id = data.posts[data.posts.length - 1].id + 1;
    }

    data.posts.push({ "id": id, ...req.body })
    res.send({ message: 'inserted successfully', body: { "id": id, ...req.body } })
})

app.delete("/api/removeallposts", (req, res) => {
    data.posts = [];
    res.send('All Post Deleted')
})

app.post('/api/addnewuser', (req, res) => {
    if (req.body) {
        const { username, email, password } = req.body;
        console.log(username, email,password)
        usersdata.users.push(req.body)
        res.send({ message: "user added successfully", success: true, body: req.body })
    }
    else {
        console.log('failed')
        res.send({ message: "failed", success: true })
    }
})

app.post('/api/verifyuser',(req,res)=>{
    const { username, password } = req.body;
    const success = flase;
    if (req.body) {
        const user = usersdata.users.filter((a)=>a.username === username);
        console.log(user)
        if(!user){
            if(user.username === username && user.password === password) success=true;
        }
        else success = false;
    }
    res.send({"success" : success});
})

//https://json-api-12345.herokuapp.com/
//https://git.heroku.com/json-api-12345.git