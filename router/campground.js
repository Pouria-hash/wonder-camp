const express = require('express')
const router = express.Router()
const wrapAsync = require('../utility/wrapAsync')
const { isLoggedIn, validateCampground, isAuthor } = require('../utility/middleware')
const campground = require('../controller/campgroundCont')
const { storage } = require('../cloudinary/index')
const multer = require('multer')
const upload = multer({ storage })




router.route('/')

    .get(wrapAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campground.creatNew));


router.get('/new', isLoggedIn, campground.newForm)

router.route('/:id')
    .get(wrapAsync(campground.showCamp))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campground.editCamp))
    .delete(isLoggedIn, wrapAsync(campground.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campground.editForm));



module.exports = router;