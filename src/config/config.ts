const config = {
  development: {
    type: "mysql",
    host: "127.0.0.1",
    // port: process.env.DB_PORT,
    username: process.env.LOCAL_DATABASE_USERNAME,
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: process.env.LOCAL_DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: ["src/entities/*.*"],
  },
  deploy: {
    type: "mysql",
    host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    synchronize: true,
    logging: true,
    entities: ["src/entities/*.*"],
  },
};

export default config;
