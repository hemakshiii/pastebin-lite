const pool =require("./db");
const {v4: uuidv4} =require("uuid");


const createPaste = async(req, res)=>{
    try{
        const{content, ttl_seconds, max_views}=req.body;


        if(!content || typeof content !== "string" || content.trim()===""){
            return res.status(400).json({error:"Content is required"});
        }

        if (ttl_seconds !== undefined &&(!Number.isInteger(ttl_seconds) || ttl_seconds<1)){
            return res.status(400).json({error:"ttl_seconds must be integer >= 1"});
        }

        if(max_views !== undefined && (!Number.isInteger(max_views)|| max_views <1)){
            return res.status(400).json({error:"max_views must be an integer >=1"})
        }

        const id=uuidv4()
        const created_at=new Date();

        let expires_at=null;
        if(ttl_seconds){
            expires_at=new Date(created_at.getTime()+ttl_seconds * 1000);
        }

        await pool.query(
            `INSERT INTO pastes (id, content, created_at, expires_at, max_views, views_used)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, content, created_at, expires_at, max_views|| null,0]
        );

        const url =`http://localhost:3000/p/${id}`;

        res.status(201).json({id, url});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal server error"});
    }
}

    const getPaste=async(req,res)=>{
        try {
            const{id}=req.params;

            const result= await pool.query(
                "SELECT * FROM pastes WHERE id= $1",
                [id]
            );

            const paste=result.rows[0];
            if (!paste){
                return res.status(404).json({error:"Paste not found"})
            }

            const now =new Date();

            if(
                (paste.expires_at && now> paste.expires_at)||
                (paste.max_views !== null && paste.views_used >= paste.max_views)
            ){
                return res.status(404).json({error:"Paste unavailable"});
            }

            await pool.query(
                "UPDATE pastes SET views_used = views_used +1 WHERE id =$1",
                [id]
            )

            res.status(200).json({
                content: paste.content,
                remaining_views:
                paste.max_views !== null
                ? paste.max_views - (paste.views_used+1):null,
                expires_at: paste.expires_at
            })
        } catch (err) {
          console.error(err);
          res.status(500).json({error:"internal server error"});
        }
    }

    const viewPasteHTML=async(req,res)=>{
        try {
            const{id}=req.params;

            const result = await pool.query(
                "SELECT * FROM pastes WHERE id =$1",
                [id]
            );

            const paste= result.rows[0];
            if(!paste){
                return res.status(404).send("paste not found");
            }

            const now =new Date();

            if(
                (paste.expires_at && now> paste.expires_at)||
                (paste.max_views !== null && paste.views_used>= paste.max_views)
            ){
                return res.status(404).send("Paste unavailable")
            }

            await pool.query(
                "UPDATE pastes SET views_used = views_used + 1 WHERE id =$1",
                [id]
            );

            const escapedContent=paste.content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

            res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head>
          <meta charset="UTF-8" />
          <title>Paste</title>
          <style>
            body {
              font-family: monospace;
              background: #111;
              color: #eee;
              padding: 20px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <pre>${escapedContent}</pre>
        </body>
      </html>`);
        } catch (err) {
          console.error(err);
          res.status(500).send("Server error")  
        }
    };

    module.exports={
        createPaste,
        getPaste,
        viewPasteHTML
    }