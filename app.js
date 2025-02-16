const express=require ("express");
const app= express();
const userModel=require("./models/user");
const postModel=require("./models/post");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const cookieParser=require ('cookie-parser');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
res.render("index");
//res.send("Ayushi");
})

app.post('/create', async(req,res)=>{
    let{name,username,age,email,password}=req.body;
    
    let user=await userModel.findOne({email});
    if(user) return res.status(500).send("user already registered");

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
          let user=await userModel.create({
            username,email,age,name,password:hash
           }); 
            let token=jwt.sign({email:email,userid:user._id},"sshhhhh");
            res.cookie("token",token);
            res.send("registered");
        })
    }) 

    // res.send({name,username,age,email,password});
    //res.send("Ayushi");
    
    })

app.get('/login', async(req,res)=>{
    res.render("login")
})
app.get('/profile', isLoggedIn, async(req,res)=>{
    console.log(req.user);
    res.render("login");
})
app.post('/login', async(req,res)=>{
        let{email,password}=req.body;
        let user=await userModel.findOne({email});
        if(!user) return res.status(401).send("Something went wrong");
    
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                let token=jwt.sign({email:email,userid:user._id},"sshhhhh");
                  res.cookie("token",token);
                res.status(400).send("succesful login");  
            } 
            else{
              res.redirect("login");  
            } 


        })
       
    });


app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect("login");
})

function isLoggedIn(req,res,next){
    if(req.cookies.token===""){
      res.send("you must be logged in");  
    } 
    else{
      let data=jwt.verify(req.cookies.token,"sshhhhh");  
      req.user=data;
      next();
    }
    
}
app.listen(3000);

