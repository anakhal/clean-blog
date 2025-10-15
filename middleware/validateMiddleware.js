//validateMiddleWare
const validateMiddleware=(req,res,next)=>{
  if(!req.body.title||!req.body.body||!req.files||!req.files.image) {
    return res.redirect('/posts/new');
    }
    //If validation passes
    next();
  }
  module.exports=validateMiddleware;