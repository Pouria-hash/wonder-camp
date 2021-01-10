const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocodeer = mbxGeocoding({ accessToken: mapboxToken })


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campground/index', { campgrounds })
}

module.exports.newForm = (req, res) => {
    res.render('campground/new')
}


module.exports.showCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!camp) {
        req.flash('error', 'cannot find campground')
        return res.redirect('/campground')
    }
    res.render('campground/camp', { camp })
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'cannot find path')
        res.redirect('/campground')
    }
    res.render('campground/edit', { camp })
}

module.exports.creatNew = async (req, res, next) => {
    const camp = req.body;
    const mapdata = await geocodeer.forwardGeocode({
        query: camp.location,
        limit: 1
    })
        .send()
    const campground = new Campground(camp)
    campground.geometry = mapdata.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'You are successfully add new campground')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body }, { runValidator: true, new: true })
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.images.push(...img)
    await camp.save()
    const deleteImages = req.body.deleteImages;
    if (deleteImages) {
        for (let filename of deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } })
    }
    console.log(camp)
    req.flash('success', 'successfully update campground')
    res.redirect(`/campground/${camp._id}`)
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully delete campground')
    res.redirect('/campground')
}