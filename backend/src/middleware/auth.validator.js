const bodyValidator = (schema)=>{
    return async(req,res,next)=>{
        try {
            const data = req.body;
            let response = await schema.validateAsync(data,{abortEarly:false});
            next();
        } catch (exception) {
            const details = exception.details.map(element => element.message);
           console.log(details);   
        }
    }
}

module.exports = bodyValidator;