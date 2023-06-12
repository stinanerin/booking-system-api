// Henriks console.log
import console from "hvb-console";

import cors from "cors";

// ------------------- Custom middlewares -------------------
import { restrict, checkAuthorization } from "./middleware.js";

// ------------------- Setup user sessions -------------------
import session from "express-session";
import bcrypt from "bcrypt";

// ------------------- Setup express -------------------
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
// For encryption of passwords
const SALT_ROUNDS = 10;

// ------------------- Setup .env & Mongo -------------------
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
import { MongoClient, ObjectId } from "mongodb";
// ObjectId is needed for accessing specific documents in mongoDB by ID


// ------------------- Connect to database -------------------
const client = new MongoClient(MONGO_URI);
await client.connect();

// Define db and collections
const db = client.db("booking-system");
app.set("mongoClient", client); // Store the MongoDB client in the app instance

const bookingsCollection = db.collection("bookings");
const usersCollection = db.collection("users");
   



// ------------------- Middlewares -------------------
app.use(express.json());
app.use(
    session({
        // don't save session if unmodified
        resave: false,
        // don't create session until something stored
        saveUninitialized: false,
        secret: "shhhh very secret string",
    })
);
// Use CORS middleware to allow cross-origin requests
app.use(cors({ origin: "*" }));

// ------------------- Routes -------------------

//! Bookings
// Get all
app.get("/api/v.1/bookings", restrict, async (req, res) => {
    try {
        const bookings = await bookingsCollection.find().toArray();

        res.json({
            acknowledged: true,
            bookings,
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            acknowledged: false,
            error: error.message,
        });
    }
});

// Get one
app.get("/api/v.1/bookings/:id", checkAuthorization, async (req, res) => {
    try {
        const booking = await bookingsCollection.findOne({
            _id: new ObjectId(req.params.id),
            user_id: req.session.userId,
        });

        res.json({
            acknowledged: true,
            booking,
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            acknowledged: false,
            error: error.message,
        });
    }
});

// Add one
app.post("/api/v.1/bookings", restrict, async (req, res) => {
    console.log(req.body);

    try {
        const { date } = req.body;

        const booking = {
            date,
            user_id: req.session.userId,
        };

        await bookingsCollection.insertOne(booking);

        res.json({
            acknowledged: true,
            booking,
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            acknowledged: false,
            error: error.message,
        });
    }
});

// Delete one
app.delete("/api/v.1/bookings/:id", checkAuthorization, async (req, res) => {
    try {
        const id = req.params.id;

        const response = await bookingsCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (response.deletedCount === 0) {
            throw new Error("No account found with the provided ID");
        }

        res.json({
            acknowledged: true,
            message: `Account #${id} successfully deleted`,
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            acknowledged: false,
            error: error.message,
        });
    }
});

//! Users

app.post("/api/v.1/user/login", async (req, res) => {
    try {
        const user = await usersCollection.findOne({
            user: req.body.loginName,
        });
        console.log(user);

        if (user) {
            const { user: username, _id, pass } = user;

            const match = await bcrypt.compare(req.body.loginPass, pass);
            if (match) {
                // Set the user as logged in under current session
                req.session.user = username;
                req.session.userId = _id;

                res.json({
                    acknowledged: true,
                    username,
                });
            } else {
                res.status(401).json({
                    acknowledged: false,
                    error: "Invalid username or password.",
                    customError: true,
                });
                return;
            }
        } else {
            res.status(401).json({
                acknowledged: false,
                error: "Invalid username or password.",
                customError: true,
            });
            return;
        }
    } catch (error) {
        console.error(error);

        res.status(401).json({
            acknowledged: false,
            error: error.message,
        });
    }
});

// Register user
app.post("/api/v.1/user/register", async (req, res) => {
    try {
        console.info("api register");

        const takenUsername = await usersCollection.findOne({
            user: req.body.regName,
        });
        console.log("takenUsername", takenUsername);
        if (!takenUsername) {
            console.log(req.body.regName);
            const hash = await bcrypt.hash(req.body.regPass, SALT_ROUNDS);

            const newUser = await usersCollection.insertOne({
                user: req.body.regName,
                pass: hash,
            });
            if (newUser.acknowledged) {
                console.log(newUser);
                req.session.user = req.body.regName;
                req.session.userId = newUser.insertedId;
                res.json({
                    acknowledged: true,
                    user: req.body.regName,
                });
            }
        } else {
            res.status(400).json({
                acknowledged: false,
                error: "Username already exists",
                customError: true,
            });
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({
            acknowledged: false,
            error: err.message,
        });
    }
});

// Get active user
app.get("/api/v.1/user/active", (req, res) => {
    console.log("req.session", req.session);
    if (req.session.user) {
        const userId = req.session.userId;
        res.json({
            acknowledged: true,
            user: req.session.user,
            userId: userId,
        });
    } else {
        res.status(401).json({
            acknowledged: false,
            error: "Unauthorized",
        });
    }
});

// Logout user
app.post("/api/v.1/user/logout", restrict, (req, res) => {
    req.session.destroy(() => {
        res.json({
            loggedin: false,
        });
    });
});


//! ------------------- Start the server -------------------
// Starting the server and listening for http requests made to the specified port
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error when listening: #", code, err);
        return;
    }
    console.log("Template is listening on port ", PORT);
});