const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const postRoutes = require('./routes/post-routes');
const authRoutes = require('./routes/auth-routes');
const port = process.env.PORT || 3049;

require('./config/passport');

//middleware
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//routes
app.use('/post', postRoutes);
app.use('', authRoutes);

//mongodb connection
app.use((req, res, next) => {
    if (mongoose.connection.readyState) next();
    else {
      mongoose
        .connect('mongodb://localhost/passport',
        {
            useNewUrlParser:true,
            useUnifiedTopology:true,
        }
        )
        .then(() => next())
        .catch(err => console.error(`Mongoose Error: ${err.stack}`));
    }
});

// app.post('/create-post', 
//   passport.authenticate('jwt', {
//     session:false, 
//   }),
//   (req, res)=>{
//       console.log(req.user)
//       res.send('success');
// });

// app.post('/test-post', 
//     passport.authenticate('jwt',{
//         session:false,
//     }),
//     (req, res)=>{
//         res.send('working properly :)')
//     }
// )


app.get('/', function(req, res){
    res.send('registered');
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
