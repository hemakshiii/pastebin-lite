const express =require("express");
 const router=express.Router()

 const {createPaste, getPaste, viewPasteHTML}=require("./controller")

 router.post("/pastes", createPaste);

 router.get("/pastes/:id", getPaste);

 router.get("/p/:id", viewPasteHTML);

 module.exports=router