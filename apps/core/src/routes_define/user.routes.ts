import { createToJSONSchemaMethod } from "zod/v4/core";
import * as UserSchema from "../zod_schemas/user.schema.js"
import { createRoute, z } from "@hono/zod-openapi";

export const errorRes = (message: string) => ({
  content: {
    "application/json": {
      schema: z.object({
        error: z.string().openapi({ example: message }),
      }),
    },
  },
  description: message,
});

export const InternalError = errorRes("INTERNAL_SERVER_ERROR");

//5.1 

export const getUserInformationRoute = createRoute({
    method: "get",
    path : "/",
    summary : "5.1 get user information",
    request : { params : z.object({id:z.string()})},
    responses :{
        200:{
            content :{
                "application/json": {schema : UserSchema.getUserInformationSchema}
            },
            description : "OK",
        },
        400: { description: "Invalid user format" },
        401: { description: "Unauthorized - Missing or invalid token" },
        404: { description: "User not found" },
        500 : InternalError,        
    },
    security : [{Bearer: []}],    
})

//5.2
const ReviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  status: z.enum(["approved", "rejected", "pending"]).optional(),
});

export const getUserReviewRoute = createRoute({
    method :"get",
    path : "/reviews",
    summary : "5.2 get user review",
    request : {query : ReviewsQuerySchema},
    responses: {
        200:{
            content:{
                "application/json": {schema : UserSchema.getReviewsResponseSchema}
            },
            description :"OK",
        },
        400: { description: "Invalid user format" },
        401: { description: "Unauthorized - Missing or invalid token" },
        404: { description: "User not found" },
        500 : InternalError, 
    },
    security : [{Bearer: []}],      
})

//5.3
const UpdateUserProfileSchema = z.object({
  name: z.string().min(1).optional(),
  faculty: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
});

export const updateUserInformationRoute = createRoute({
    method :"patch",
    path : "/",
    summary : "5.3 update user information",
    request : {
        body: {
        content: {
            "application/json": {
            schema: UpdateUserProfileSchema,
            },
        },
        description: "Fields to update",
        },
    },
    responses: {
        200:{
            content:{
                "application/json": {schema : UserSchema.updateUserProfileResponseSchema}
            },
            description :"OK",
        },
        400: { description: "Invalid user format" },
        401: { description: "Unauthorized - Missing or invalid token" },
        404: { description: "User not found" },
        500 : InternalError, 
    },
    security : [{Bearer: []}],      
})
