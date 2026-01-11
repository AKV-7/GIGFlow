import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

// @desc    Create new bid
// @route   POST /api/bids
// @access  Private
export const createBid = async (req, res, next) => {
  try {
    const { gigId, message, proposedPrice } = req.body;
    
    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
    }

    if (gig.status !== 'open') {
        res.status(400);
        throw new Error('Gig is not open for bids');
    }

    // Check if user is owner
    if (gig.ownerId.toString() === req.user.id) {
        res.status(400);
        throw new Error('Cannot bid on your own gig');
    }

    // Check if already placed a bid
    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user.id });
    if (existingBid) {
        res.status(400);
        throw new Error('You have already placed a bid');
    }

    const bid = await Bid.create({
        gigId,
        freelancerId: req.user.id,
        message,
        proposedPrice
    });

    // Notify Owner via Socket.io
    const io = req.app.get('io');
    if (io) {
        io.to(gig.ownerId.toString()).emit('new_bid', {
            gigId,
            gigTitle: gig.title,
            freelancerName: req.user.name
        });
    }

    res.status(201).json({
        success: true,
        data: bid
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get bids for a gig
// @route   GET /api/bids/:gigId
// @access  Private (Owner Only)
export const getBids = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.gigId);

        if (!gig) {
            res.status(404);
            throw new Error('Gig not found');
        }

        if (gig.ownerId.toString() !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to view bids for this gig');
        }

        const bids = await Bid.find({ gigId: req.params.gigId })
            .populate('freelancerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bids
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Hire a freelancer (Atomic with findOneAndUpdate)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Owner Only)
export const hireBid = async (req, res, next) => {
  try {
    const bid = await Bid.findById(req.params.bidId).populate('gigId');

    if (!bid) {
      res.status(404);
      throw new Error('Bid not found');
    }

    const gig = bid.gigId;

    // Verify ownership
    if (gig.ownerId.toString() !== req.user.id) {
       res.status(403);
       throw new Error('Not authorized to hire for this gig');
    }

    // ATOMIC: Use findOneAndUpdate with condition to prevent race condition
    // Only update if status is still 'open'
    const updatedGig = await Gig.findOneAndUpdate(
      { _id: gig._id, status: 'open' },
      { status: 'assigned' },
      { new: true }
    );

    if (!updatedGig) {
       res.status(400);
       throw new Error('Gig is no longer open for hiring');
    }

    // Update the chosen bid to 'hired'
    bid.status = 'hired';
    await bid.save();

    // Reject all other pending bids for this gig
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id }, status: 'pending' },
      { status: 'rejected' }
    );

    // Notify the freelancer via Socket.io
    const io = req.app.get('io');
    if (io) {
        io.to(bid.freelancerId.toString()).emit('hired', {
            gigId: gig._id,
            gigTitle: gig.title,
            message: `You have been hired for ${gig.title}`
        });
    }

    res.status(200).json({
      success: true,
      data: bid
    });

  } catch (error) {
    next(error);
  }
};
