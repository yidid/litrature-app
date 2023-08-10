const express= require("express");
const {MongoClient} =require('mongodb');
const PORT= process.env.PORT || 8000
const app=express();


app.use(express.json({extended:false}))

app.get('/', (req,res)=>{
    res.send("hello world");
});

app.get('/api/articles/:name',async(req,res)=>{
    try {
        const articleName =req.params.name;
        const client= await MongoClient.connect("mongodb://127.0.0.1");
        const db= client.db('articles')
        const articlesInfo= await db
        .collection('articles')
        .findOne({name:articleName});
        res.status(200).json(articlesInfo)
       client.close();
        
    } catch (error) {
        res.status(500).json({message:"Error conneting to database" ,error})
        
    }
    

});

app.post('/api/articles/:name/add-comments', async (req,res)=>{
  
  
    try {
        const {username, text} =req.body
        const articleName =req.params.name;
        const client= await MongoClient.connect("mongodb://127.0.0.1");
        const db= client.db('articles')
        const articlesInfo= await db
        .collection('articles')
        .findOne({name:articleName})
        await db.collection('articles').updateOne({name:articleName},{
            $set :{
                comments:articlesInfo.comments.concat({username,text}),
            }
        })
        const updateArticleInfo= await db.collection('articles').findOne({name:articleName})
        res.status(200).json(updateArticleInfo)
        client.close();   
    } catch (error) {
        res.status(500).json({message:"Error conneting to database" ,error}) 
    }
});
app.listen(PORT, ()=>console.log(`server started at port ${PORT}`))
