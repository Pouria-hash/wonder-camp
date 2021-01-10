const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.creatNewReview = async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body)
    review.author = req.user._id;
    console.log(review)
    const campground = await Campground.findById(id)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    req.flash('success', 'successfully add a review')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success', 'successfully delete your review')
    res.redirect(`/campground/${id}`)

}