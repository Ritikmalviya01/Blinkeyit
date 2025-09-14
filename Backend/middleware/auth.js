import jwt from 'jsonwebtoken'

const auth = async(req , res , next ) => {
    try {
        const token = req.cookies.accessToken || req?.header?.authorization?.split(" ")[1] 
        console.log("token :", token)
        if(!token){
            return res.status(401).json({
                message : "Provide Token"
            })
        }

        const decode = await jwt.verify(token , process.env.SECRET_KEY_ACCESS_TOKEN )


        console.log("decode" ,decode)
        if(!decode){
            return res.status(401).json({
                message : "unauthorized axxess",
                error :true,
                success :false
            })
        }
        req.userId = decode.id
        next()
    } catch (error) {
        return res.status(500).json({
      message :error.message || error ,
      error :true ,
      success :false
    })
    }
    
}

export default auth