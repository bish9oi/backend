import {asyncWrapper} from '../utils/asyncWrapper.js';
import {ApiError} from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import { Doctor } from '../models/doctor.model.js';
import { Patient } from '../models/patient.model.js';

export const verifyJwt = asyncWrapper(async (req, res, next) => {
   try {
     const token = req.cookies.accessToken 
     if (!token) {
         throw new ApiError(401, "Unauthorized, no access token provided");
     }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );
    const doctor = await Doctor.findById(decodedToken?._id).select("-password -refreshToken")
     if (!doctor) {
          throw new ApiError(401, "Invalid access token");
     }
     req.doctor = doctor;
     next()
   } catch (error) {
      throw new ApiError(401, error?.message || "Unauthorized, invalid access token");
   }
})

export const verifyJwtPatient = asyncWrapper(async (req, res, next) => {
   try {
     const token = req?.cookies?.accessToken 
     if (!token) {
         throw new ApiError(401, "Unauthorized, no access token provided");
     }
     console.log(token)
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );
    const patient = await Patient.findById(decodedToken?._id).select("-password -refreshToken")
     if (!patient) {
          throw new ApiError(401, "Invalid access token");
     }
     req.patient = patient;
     next()
   } catch (error) {
      throw new ApiError(401, error?.message || "Unauthorized, invalid access token");
   }
})