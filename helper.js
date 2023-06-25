export const deleteExpiredBookings = async (app) => {
    console.log("deleteExpiredBookings running");
    try {
        const bookingsCollection = app.locals.bookingsCollection;

        const ISOCurrentDate = new Date().toISOString()
        console.log("ISOCurrentDate", ISOCurrentDate);

        const response = await bookingsCollection.deleteMany({
            date: { $lt: ISOCurrentDate },
        });
        console.log(`${response.deletedCount} expired bookings deleted`);

    } catch (error) {
        console.error("Error deleting expired bookings", error);
    }
};
