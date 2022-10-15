const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json())
const blogData = require('./blogs.json')
const usersdata = require('./users.json')
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('listening to port', port)
})

app.get('/', (req, res) => {
    res.send('working');
})

app.get("/api/allposts", (req, res) => {
    res.send(blogData);
})

app.post("/api/newpost", (req, res) => {
    let id = 0;
    if (blogData.posts.length !== 0) {
        id = blogData.posts[blogData.posts.length - 1].id + 1;
    }

    blogData.posts.push({ "id": id, ...req.body })

    res.send({ message: 'inserted successfully', body: { "id": id, ...req.body } })

    fs.writeFile('blogs.json', JSON.stringify({ "posts": blogData.posts }), (err) => {
        if (err) { console.error(err); return; };
        console.log("File has been saved");
    });
})

app.delete("/api/removeallposts", (req, res) => {
    blogData.posts = [];
    res.send('All Post Deleted')
})

app.post('/api/addnewuser', (req, res) => {
    if (req.body) {
        const { username, email, password } = req.body;
        let isDuplicate = false;
        isDuplicate = usersdata.users.find((a) => a?.username === username)

        if (!isDuplicate) {
            usersdata.users.push(req.body);

            res.send({ message: "user added successfully", success: true, body: req.body })
            fs.writeFile('users.json', JSON.stringify({ "users": usersdata.users }), (err) => {
                if (err) { console.error(err); return; };
                console.log("File has been created");
            });
        }else res.send({ message: "Duplicate username", success: false, body: req.body })
    }
    else {
        console.log('failed')
        res.send({ message: "failed", success: true })
    }
})

app.post('/api/verifyuser', (req, res) => {
    const { username, password } = req.body;
    let success = false;
    if (req.body) {
        const user = usersdata.users.filter((a) => a.username === username);
        console.log(user);
        if (!user) {
            if (user.username === username && user.password === password) success = true;
        }
        else success = false;
    }
    res.send({ "success": success });
})


app.get('/api/allusers', (req, res) => {
    res.send(usersdata)
})


//https://json-api-12345.herokuapp.com/
//https://git.heroku.com/json-api-12345.git