import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import basicAuth from "express-basic-auth";
import { env } from "../../env";



export const swaggerLoader = function (app: INestApplication): void {


  const options = new DocumentBuilder()
    .setTitle("Auth")
    .setDescription("Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const swaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: "none",
      operationsSorter: "alpha",
      tagsSorter: "alpha"
    }
  };

  const document = SwaggerModule.createDocument(app, options);

  app.use(
    env.swagger.route,
    env.swagger.username
      ? basicAuth({
          users: {
            [`${env.swagger.username}`]:
              env.swagger.password
          },
          challenge: true
        })
      : (req, res, next) => next()
  );

  SwaggerModule.setup(
    env.swagger.route,
    app,
    document,
    swaggerCustomOptions
  );
};
