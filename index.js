const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const userRoutes = require('./router/user');


 

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api/users', userRoutes);




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
