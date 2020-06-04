const formatPostCollection = (posts) =>{
    return posts.map(formatPost)
}

const formatPost = (post) => {
    return {
        creatorName: post.creatorName, 
        title: post.title,
        body: post.body, 
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        slug: post.slug,
    }
}



module.exports.formatPostCollection = formatPostCollection;
module.exports.formatPost = formatPost;