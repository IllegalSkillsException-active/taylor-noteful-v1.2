const logger= function(req, res, next){
const time = new Date(); 
console.log(` ${time.toDateString()}, ${time.toLocaleTimeString('en-US')}, ${req.method} ${req.url}`); 
next();     
}
module.exports= {logger};