const express=require("express");
 const cors = require("cors");
 require("dotenv").config();
 const pool =require("./db")

 const pasteRoutes=require("./route");
 const frontendRoutes=require("./frontend")

 const app= express()
 const PORT=process.env.PORT || 3000

 app.use(cors());
 app.use(express.json());

 app.get("/api/healthz", async(req, res)=>{
    try {
        await pool.query("SELECT 1");
        res.status(200).json({ok: true});
    } catch (error) {
        res.status(500).json({ok: false});
    }
 });


 app.use("/api", pasteRoutes);

 app.use("/", frontendRoutes);

 app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
 });