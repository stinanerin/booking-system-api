import { ObjectId } from "mongodb"; // Import the ObjectId class

// Need to be signed in
export const restrict = (req, res, next) => {
    if (req.session.user) {
        // If user is signed in - continue
        next();
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
};

// Need to signed in and the owner of booking they are trying to access
export const checkAuthorization = async(req, res, next) => {
    try {
        const bookingsCollection = req.app.locals.bookingsCollection;

        // Is current user, owner of the booking they are currently trying to access
        const booking = await bookingsCollection.findOne({
            _id: new ObjectId(req.params.id),
            user_id: req.session.userId, // Check ownership
        });

        console.log("booking", booking);

        if (booking) {
            next();
        } else {
            res.status(401).json({
                acknowledged: false,
                error: "Unauthorized",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
};
