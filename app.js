const express=require ("express");
const app= express();
const userModel=require("./models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//app.use(cookieParser());

app.get('/',(req,res)=>{
res.render("index");
//res.send("Ayushi");
})

app.post('/create', async(req,res)=>{
    let{name,username,age,email,password}=req.body;
    let createUser=userModel.create({
        name,username,age,email,password
    })
    let user=await userModel.findOne({email});
    if(user) return res.status(500).send("user already registered");

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
          let user=await userModel.create({
            username,email,age,name,password:hash
           })
            
        })
    })
    // res.send({name,username,age,email,password});
    //res.send("Ayushi");
    
    })

app.listen(3000);

