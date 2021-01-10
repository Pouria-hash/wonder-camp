const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utility/wrapAsync')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utility/middleware')
const review = require('../controller/reviewCont')




router.post('/', isLoggedIn, validateReview, wrapAsync(review.creatNewReview))


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(review.deleteReview))


module.exports = router;