const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const PostSchema = new Schema({
        title: {type: String, required:true},
        body: {type:String, required: true},
        creatorId: {type: String, required: true},
        creatorName: {type: String, required: true},
        slug: {type: String, slug: "title", unique: true },
    }, {timestamps: true}
)

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;