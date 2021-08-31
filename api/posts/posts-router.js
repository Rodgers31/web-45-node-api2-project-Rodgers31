// implement your posts router here

const express = require('express');

const Post = require('./posts-model');

const router = express.Router();

// | 1 | GET    | /api/posts              | Returns **an array of all the post objects** contained in the database
router.get('/', (req, res) => {
	Post.find(req.body)
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((error) => {
			res.status(500).json({
				message: 'The posts information could not be retrieved',
				error: error.message,
			});
		});
});
// | 2 | GET    | /api/posts/:id          | Returns **the post object with the specified id**

router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			if (!post) {
				res.status(404).json({
					message: 'The post with the specified ID does not exist',
				});
			} else {
				res.status(200).json(post);
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: 'The post information could not be retrieved',
				error: error.message,
			});
		});
});
// | 3 | POST   | /api/posts              | Creates a post using the information sent inside the request body and returns **the newly created post object**
// | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
// | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**
// | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id

module.exports = router;
