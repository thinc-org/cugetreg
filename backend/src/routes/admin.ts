import { prisma } from "../db/clients.js";
import { OpenAPIHono } from "@hono/zod-openapi";

const admin = new OpenAPIHono();

export default admin;
