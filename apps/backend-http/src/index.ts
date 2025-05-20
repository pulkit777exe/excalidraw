import express from "express";


const app = express();
app.use(express.json());

app.post("signup", async function (req, res) {

})

app.post("/signin", async function (req, res) {

})

app.post("/room/:roomid", async function (req, res) {
    
})

app.listen(3000);
