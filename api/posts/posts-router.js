// implement your posts router here

const express = require('express');
const { response } = require('../server');

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
router.post('/', (req, res) => {
	// missing required params
	if (!req.body.title || !req.body.contents) {
		res.status(400).json({
			message: 'Please provide title and contents for the post',
		});
		return;
	}

	Post.insert(req.body)
		.then((post) => {
			if (post) {
				Post.findById(post.id).then((post) => {
					res.status(201).json(post);
				});
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				message: 'There was an error while saving the post to the database',
			});
		});
});
// | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original

router.put('/:id', (req, res) => {
	const id = req.params.id;
	const changes = req.body;
	if (!changes.title || !changes.contents) {
		res.status(400).json({
			message: 'Please provide title and contents for the post',
		});
	} else {
		Post.update(id, changes)
			.then((post) => {
				if (post) {
					return Post.findById(id);
				} else {
					res.status(404).json({
						message: 'The post with the specified ID does not exist',
					});
				}
			})
			.then((post) => {
				res.status(200).json(post);
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({
					message: 'The post information could not be modified',
				});
			});
	}
});

// | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**

router.delete('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			if (!post) {
				res.status(404).json({
					message: 'The post with the specified ID does not exist',
				});
			} else {
				Post.remove(req.params.id).then((response) => {
					res.status(200).json(post);
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: 'The post could not be removed',
				error: error.message,
			});
		});
});
// | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id
router.get('/:id/comments', (req, res) => {
	const id = req.params.id;
	Post.findById(id).then((post) => {
		if (post) {
			Post.findPostComments(id)
				.then((comments) => {
					res.status(200).json(comments);
				})
				.catch((error) => {
					console.log(error);
					res.status(500).json({
						message: 'The comments information could not be retrieved',
					});
				});
		} else {
			res.status(404).json({
				message: 'The post with the specified ID does not exist',
			});
		}
	});
});
module.exports = router;
