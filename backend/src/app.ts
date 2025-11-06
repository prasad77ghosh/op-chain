import express, { Application } from "express";
import { createServer, Server } from "http";
import path from "path";
import fs from "fs";
import DB from "./db/databse";

class App {
  public app: Application;
  public static server: Server;

  constructor() {
    this.app = express();
    DB.connect();
  }

  public listen(serverPort: number) {
    const options = {};
    App.server = createServer(options, this.app);
    App.server.listen(serverPort, (): void => {
      const middlewares = fs.readdirSync(path.join(__dirname, "/middlewares"));
      this.middleware(middlewares, "top.");
      this.routes();
      this.middleware(middlewares, "bottom.");
      console.log(`Listening on ${serverPort}...`);
    });
  }

  private middleware(middlewares: any[], str: "bottom." | "top.") {
    middlewares.forEach((middleware) => {
      if (middleware.includes(str)) {
        import(path.join(__dirname + "/middlewares/" + middleware)).then(
          (middleReader) => {
            new middleReader.default(this.app);
          }
        );
      }
    });
  }

  private routes() {
    const subRoutes = fs.readdirSync(path.join(__dirname, "/routes"));
    subRoutes.forEach((file: any): void => {
      if (file.includes(".routes.")) {
        import(path.join(__dirname + "/routes/" + file)).then((route) => {
          const rootPath = `/api/v1/${new route.default().path}`;
          this.app.use(rootPath, new route.default().router);
        });
      }
    });
  }
}

export default App;
