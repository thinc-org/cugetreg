import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../db/clients.js";
import { getCourseQuerySchema, courseDetailsSchema } from "../zod_schemas/courses.schema.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { getCoursesRoute,getCourseByNoRoute } from "../routes_define/courses.routes.js";
import { Effect,Console } from "effect";

const courses = new OpenAPIHono()

  //1.1get courses
  .openapi(getCoursesRoute,async (c) =>{
    const user = c.get("user");
    const userId = user.id;
    const {studyProgram,academicYear,semester,
      q,genEdType,faculty,day ,timeStart, timeEnd, noPrereq, fitCardId , assessment,sortBy
      ,sortOrder,limit 
    } = c.req.valid("query");
    const program = Effect.gen(function* (){
      const userCourses = yield* Effect.tryPromise({
        try: ()=>
          prisma.cart.findMany({
            where:{
              userId,
              studyProgram,
              academicYear,
              semester,
              q,
              genEdType,
              faculty,  
              day,
              timeStart,
              timeEnd,
              noPrereq,
              fitCardId,
              assessment,
            },
            orderBy: sortBy ? {
              [sortBy]: sortOrder || 'asc' // Defaults to 'asc' if sortOrder is missing
            } : undefined,
            take: limit ? Number(limit) : undefined, // Useful if you also want to apply the limit
          }),
        catch: (error) => new Error(`Prisma Error: ${error}`),
      });
      return c.json({data: userCourses}, 200);
    }).pipe(
      Effect.catchAll((err) =>{
        return Effect.gen(function* () {
          yield* Console.error("Fetch Carts Error:", err);
          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        });        
      })
    );
    return await Effect.runPromise(program);
  })
  .openapi(getCourseByNoRoute, async (c) => {
    const { courseNo } = c.req.valid("param"); // Validated by Zod
    const {studyProgram,academicYear,semester} = c.req.valid("query");
    const program = Effect.gen(function* () {
      const course = yield* Effect.tryPromise({
        try: () => prisma.course.findUnique({
          where:
           { courseNo: courseNo,
            studyProgram: studyProgram,
            academicYear: academicYear,
            semester: semester,
           }
        }),
        catch: (e) => new Error("DB Error")
      });

      if (!course) {
        return c.json({ message: "Course not found" }, 404);
      }

      return c.json(course, 200);
    }).pipe(
      Effect.catchAll((err) =>{
        return Effect.gen(function* () {
          yield* Console.error("Fetch Carts Error:", err);
          return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
        });        
      })
    );
    return await Effect.runPromise(program);
  })


export default courses;
