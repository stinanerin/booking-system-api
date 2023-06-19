export const deleteExpiredBookings = async() => {
    console.log("deleteExpiredBookings running");
    try {

        const client = req.app.get("mongoClient"); // Access the MongoDB client from the app instance
        const bookingsCollection = client
            .db("booking-system")
            .collection("bookings");

        console.log(
            "bookingsCollection inside deleteExpiredBookings",
            bookingsCollection
        );

        await bookingsCollection.deleteMany({ date: { $lt: new Date() } });

        console.log("Expired bookings deleted.")

    } catch (error) {
        console.error("Error deleting expired bookings", error)
    }
};
