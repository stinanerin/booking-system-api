export const deleteExpiredBookings = async (app) => {
    console.log("deleteExpiredBookings running");
    try {
        const bookingsCollection = app.locals.bookingsCollection;

        console.log(
            "bookingsCollection inside deleteExpiredBookings",
            bookingsCollection
        );

        const response = await bookingsCollection.deleteMany({
            date: { $lt: new Date() },
        });
        console.log(`${response.deletedCount} expired bookings deleted`);

    } catch (error) {
        console.error("Error deleting expired bookings", error);
    }
};
