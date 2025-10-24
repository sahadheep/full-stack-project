const Profile = require('../models/Profile');
const Post = require('../models/Post');
const User = require('../models/User');

async function search(req, res, next) {
    try {
        const { query, type = 'all', page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        if (!query) {
            return res.status(400).json({
                status: 'error',
                message: 'Search query is required'
            });
        }

        const searchRegex = new RegExp(query, 'i');
        let results = { profiles: [], posts: [], total: 0 };

        if (type === 'all' || type === 'profiles') {
            // Search profiles
            const profileResults = await Profile.find({
                $or: [
                    { bio: searchRegex },
                    { interests: searchRegex },
                    { 'location.city': searchRegex },
                    { 'location.country': searchRegex }
                ]
            })
            .populate({
                path: 'userId',
                select: 'name email',
                match: { name: searchRegex }
            })
            .skip(type === 'profiles' ? skip : 0)
            .limit(type === 'profiles' ? Number(limit) : 5)
            .lean();

            // Only include profiles where user data exists and either profile or user matches search
            results.profiles = profileResults.filter(profile => profile.userId);
            
            if (type === 'profiles') {
                results.total = await Profile.countDocuments({
                    $or: [
                        { bio: searchRegex },
                        { interests: searchRegex },
                        { 'location.city': searchRegex },
                        { 'location.country': searchRegex }
                    ]
                });
            }
        }

        if (type === 'all' || type === 'posts') {
            // Search posts
            const postResults = await Post.find({
                $or: [
                    { title: searchRegex },
                    { content: searchRegex }
                ]
            })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(type === 'posts' ? skip : 0)
            .limit(type === 'posts' ? Number(limit) : 5);

            results.posts = postResults;

            if (type === 'posts') {
                results.total = await Post.countDocuments({
                    $or: [
                        { title: searchRegex },
                        { content: searchRegex }
                    ]
                });
            }
        }

        // If searching all, combine total
        if (type === 'all') {
            results.total = results.profiles.length + results.posts.length;
        }

        res.json({
            status: 'success',
            data: results,
            pagination: type !== 'all' ? {
                page: Number(page),
                totalPages: Math.ceil(results.total / limit),
                total: results.total
            } : null
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { search };