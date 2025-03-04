const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Social Media Website Machine Task",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    paths: {
      "/api/v1/signin": {
        get: {
          summary: "Returns a simple greeting",
          responses: {
            200: {
              description: "A successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Hello, World!",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  
  export default swaggerDefinition;
  