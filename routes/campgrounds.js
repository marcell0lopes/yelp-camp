const express = require('express');
const router = express.Router();
//Util Scripts and Schemas
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

const { campgroundSchema } = require('../schemas.js');

// CRUD
// Index
router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

// Create:
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Details:
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
        },
      })
      .populate('author');
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/details', { campground });
  })
);

// Edit:
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  })
);

// Update:
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//DELETE
router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
