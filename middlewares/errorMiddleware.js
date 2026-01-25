import AppError from "../utils/AppError.js";
 
export const globalErrorHandler = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"

    //log for developers
    console.log("ERROR", err);

    //operational error
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    //unknown error
    return res.status(500).json({
        status: "error",
        message: "Someting went wrong",
    });
};