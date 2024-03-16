const express = require('express')
const axios = require('axios')

const app = express()
app.get('/',(req,res)=>{
    const {data}=axios.get('https://indian-cities-api-nocbegfhqg.now.sh/cities')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));
})

app.listen(5000,()=>{
    console.log("App is listening on port 5000")
})