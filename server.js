// Henriks console.log
import console from "hvb-console";

// ------------------- Setup express -------------------
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;


// ------------------- Setup .env & Mongo -------------------
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
import { MongoClient, ObjectId } from "mongodb";
// ObjectId is needed for accessing specific documents in mongoDB by ID

let bookingsCollection;
let usersCollection;


// ------------------- Connect to db -------------------

if (MONGO_URI) {
    const client = new MongoClient(MONGO_URI);
    client
        .connect()
        .then(() => {
            console.log("Connected to MongoDB via MONGO_URI");

            // Define db and collections
            const db = client.db("booking-system");
            bookingsCollection = db.collection("bookings");
            usersCollection = db.collection("users");
        })
        .catch((error) => {
            console.log("Error connecting to MongoDB:", error);
        });
} else {
    console.log("No MongoDB URI provided. Starting with local MongoDB.");
    const client = new MongoClient("mongodb://localhost:27017");
    client
        .connect()
        .then(() => {
            console.log("Connected to local MongoDB");
            const db = client.db("booking-system");
            bookingsCollection = db.collection("bookings");
            usersCollection = db.collection("users");
        })
        .catch((error) => {
            console.log("Error connecting to local MongoDB:", error);
        });
}


//! ------------------- Start the server -------------------
// Starting the server and listening for http requests made to the specified port
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error when listening: #", code, err);
        return;
    }
    console.log("Template is listening on port ", PORT);
});