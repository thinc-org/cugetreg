import { Hono } from "hono";
import { prisma } from "../db/clients.js";

const admin = new Hono()

export default admin
