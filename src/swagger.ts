import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking API",
      version: "1.0.0",
      description: "API documentation for the Booking service",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      schemas: {
        Booking: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            providerId: { type: "string" },
            status: { type: "string" },
          },
        },
        BookingCreate: {
          type: "object",
          required: ["userId", "providerId"],
          properties: {
            userId: { type: "string" },
            providerId: { type: "string" },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  // Point to the files where API JSDoc comments will live (broadened to catch all TS/JS under src)
  apis: ["./src/**/*.ts", "./src/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// Diagnostic: log how many paths swagger-jsdoc discovered (helps debug "No operations defined")
const pathCount = (swaggerSpec as any).paths ? Object.keys((swaggerSpec as any).paths).length : 0;
console.log(`🧭 Swagger spec generated with ${pathCount} path(s)`);
if ((swaggerSpec as any).paths) {
  console.log("📌 Swagger discovered paths:", Object.keys((swaggerSpec as any).paths));
}

export default swaggerSpec;
