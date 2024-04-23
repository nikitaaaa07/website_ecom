const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors()); //connect to express using 4000 port

//Database connect with mongodb
mongoose.connect("mongodb+srv://ecommerceproject:ayL1WUDoPNKg0Hcp@cluster0.mg2pynt.mongodb.net/e-commerce")

//APT Creation
app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//schema creating user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now(),
    }
})

//creating endpoint for registering user
app.post('/signup',async (req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success:false,errors:"existing user found with same email"});
    }
    let cart ={};
    for (let i=0;i<300;i++){
        cart[i]=0;
    }
    const user =new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data={
        user:{
            id:user.id
        }
    }
    const token =jwt.sign(data,"secret_ecom");
    res.json({success:true,token}) 
})



//creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user= await Users.findOne({email:req.body.email});
    if(user){
        const passCompare=req.body.password === user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token =jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,error:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"});
    }
})

const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
        try{
            const data=jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }
        catch(error){
            res.status(401).send({errors:"please autenticate using valid token"})
        }
    }
}

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port "+port)
    }
    else{
        console.log("Error: "+error)
    }
})