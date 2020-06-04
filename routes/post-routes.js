const passport = require('passport');
const Post = require('../post-model');
var express = require('express');
var router = express.Router();
const formatPost = require('../util/util').formatPost;
const formatPostCollection = require('../util/util').formatPostCollection;
// const User = require('../passport-models');

router.get('/delete-all',
    passport.authenticate('jwt', {session:false}),
    async (req,res,next) =>{
        await Post.deleteMany({}, null);
        res.send({
            message: "deleted everything",
        })
    }
)
router.post('/create-post', 
    passport.authenticate('jwt', {session:false}), 
    async (req, res, next)=>{
        const creatorId= req.user._id;
        const creatorName= req.user.username;
        const {title, body}= req.body;
        const post = await Post.create({creatorId, creatorName, title, body});
        
        res.send(formatPost(post));
    }
)

router.get('/get-posts',
    async (req, res, next)=>{
        const allPosts = await Post.find();
        const formattedPosts = formatPostCollection(allPosts);
        res.send({posts: [...formattedPosts]});
    }
)

router.get('/user/:username',
    async (req, res, next)=>{
        const user = req.params.username;
        const postsByUsername = await Post.find({creatorName: user});
        const formattedPosts = formatPostCollection(postsByUsername);
        res.send({posts: [...formattedPosts]});
    }
)

router.get('/:slug',
    async (req, res, next) =>{
        const slug = req.params.slug;
        const postDetails = await Post.findOne({slug});
        const formattedPost = formatPost(postDetails);
        res.send(formattedPost);
    }
)

module.exports = router;