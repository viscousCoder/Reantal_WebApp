import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
// import { getConnection } from "./database/db.config";
import authRoute from "./routes/auth";
import ownerRoute from "./routes/owner";
import paymentRoute from "./routes/payment";
import adminRoute from "./routes/admin";
import { getConnection } from "./database/db.config";
import { handleAuthentication } from "./middleware/AuthMiddleware";

const app: Application = express();
const port = 1234;
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://rentalapp02.netlify.app",
    methods: ["PUT", "POST", "DELETE", "GET", "PATCH"],
    credentials: true,
  })
);

async function init() {
  try {
    await getConnection();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(handleAuthentication);

    //routes

    app.use("/", authRoute);
    app.use("/", ownerRoute);
    app.use("/", paymentRoute);
    app.use("/", adminRoute);
    app.listen(port, () => console.log("Server is running at port ", port));
  } catch (error) {
    console.log(`Error while connection ${error}`);
  }
}

init();
