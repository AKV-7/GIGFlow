import Gig from '../models/Gig.js';

// @desc    Get all gigs
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }
    
    if (status) {
      query.status = status;
    } else {
        query.status = 'open';
    }

    const gigs = await Gig.find(query).populate('ownerId', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

    if (!gig) {
      res.status(404);
      throw new Error('Gig not found');
    }

    res.status(200).json({
      success: true,
      data: gig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req, res, next) => {
  try {
    req.body.ownerId = req.user.id; // Add user to req.body

    const gig = await Gig.create(req.body);

    res.status(201).json({
      success: true,
      data: gig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private
export const deleteGig = async (req, res, next) => {
    try {
      const gig = await Gig.findById(req.params.id);
  
      if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
      }
  
      // Make sure user is gig owner
      if (gig.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(403);
        throw new Error(`User ${req.user.id} is not authorized to delete this gig`);
      }
  
      await gig.deleteOne();
  
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  };
