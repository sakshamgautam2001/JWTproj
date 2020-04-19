//Importing Required packages
const express=require('express');
const jwt=require('jsonwebtoken');           //importing JWT
const app=express();                         //Creating app in express framework
const jimp=require('jimp')                   //Importing library to generate thumbnail


//Creating GET Method for default URL
app.get('/',(req,res)=>{
    res.json({messege:'Welcome to the API'});
});

//POST Method secured with JWT to download the thumbnail
app.post('/post',verifyToken,(req,res)=>{
    //Verifying Token
    jwt.verify(req.token,'enter_secret_key_here',(err,data)=>{
        if(err){
            res.sendStatus(403);      //Forbidden
        }
        else{
            //Downloading Thumbnail
            jimp.read('https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg' ,(err,image)=>{
                if(err) throw err;
                image.cover(50,50)
                .write('new.jpg')
                
                //Getting information of User and Thumbnail in form of json
                res.json({
                    messege:'Thumbnail Download Successful',
                    data,             //Showing data of user
                    image,            //Showing data of thumbnail
                });
            });
        }
    }); 
});

//POST Method for login to create a new brand JWT
app.post('/login',(req,res)=>{
    //Random User pair
    const user={
        id:'saksham123',
        password:'gtsman'
    };
    
    //Signing JWT 
    jwt.sign({user},'enter_secret_key_here',{expiresIn:'180s'},(err,token)=>{
        if(err){                            //Token will expire after 180s
            throw err;
        }
        res.json({token});     //Returning of JWT
    });
});


//Function to verify the Token to get the thumbnail
function verifyToken(req,res,next){
    //Getting the input token value
    const tokenValue=req.headers['authorization'];        //Fetching the input value of token in the header
    if(typeof tokenValue!=='undefined'){
        req.token=tokenValue;                         //Passing the token value further
        next();
    }
    else{
        res.sendStatus(403);        //Forbidden
    }
}


//Running app on local server
app.listen(3000,()=>{
    console.log('app running on port 3000');
});