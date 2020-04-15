const http=require('http');
const hostname='localhost';
const port=3088;
const server=http.createServer((req,res)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    // res.write('hello nodejs')
    res.end('hii\n vv nodejs');
});

server.listen(port,hostname,()=>{
    console.log('runni uggjbjv ng...')
})