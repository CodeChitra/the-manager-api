export const allowedOrigins = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
];

export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
