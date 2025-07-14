// // export const HTTP_BACKEND = "http://localhost:8080/api/v1/user";
// // export const WS_BACKEND = "http://localhost:8081";

// export const HTTP_BACKEND = "https://excaliboard-backend.onrender.com/api/v1/user";
// export const WS_BACKEND = "wss://excaliboard-ws-backend-2.onrender.com";


const isProduction = process.env.NODE_ENV === "production";

export const HTTP_BACKEND = isProduction ? "https://excaliboard-http-backend.onrender.com/api/v1/user" : "http://localhost:8080/api/v1/user";

export const WS_BACKEND = isProduction ? "ws://excaliboard-ws-backend.onrender.com" : "http://localhost:8081";