import express from "express";
import authUser from "../middlewares/authUser.js";
import { AddAddress, GetAddress } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/add", authUser, AddAddress);
addressRouter.get("/get", authUser, GetAddress);

export default addressRouter;