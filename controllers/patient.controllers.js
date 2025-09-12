import { Patient } from '../models/patient.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { Response } from '../utils/Response.js';

// generateAccessToken and generateRefreshToken 
const generateTokens = async (userId) => {
   const patient = await Patient.findById(userId);
   if (!patient) {
       throw new ApiError(404, 'User not found');
   }

   const accessToken =await patient.generateAccessToken();
   const refreshToken =await patient.generateRefreshToken();

   // Save refresh token in DB
   patient.refreshToken = refreshToken;
   await patient.save({ validateBeforeSave: false });

   return { accessToken, refreshToken };
};

// Controller for patient registration
export const registerPatient = asyncWrapper(async (req, res) => {
   const { email, fullname, password, username } = req.body;

   if ([email, fullname, password, username].some(field => !field?.trim())) {
       throw new ApiError(400, 'All fields are required');
   }

   const patientExist = await Patient.findOne({ $or: [{ email }, { username }] });
   if (patientExist) {
       throw new ApiError(400, 'User already exists with this email or username');
   }

   const patient = await Patient.create({ email, fullname, username, password });
   if (!patient) {
       throw new ApiError(500, 'User registration failed');
   }

   const createdPatient = await Patient.findById(patient._id).select('-password -refreshToken');

   res.status(201).json(
       new Response(201, createdPatient, 'Patient registered successfully')
   );
});

// Patient login
export const loginPatient = asyncWrapper(async (req, res) => {
   const { email, username, password } = req.body;

   if (!email && !username) {
       throw new ApiError(400, 'Email or username is required');
   }
   if (!password) {
       throw new ApiError(400, 'Password is required');
   }

   const patient = await Patient.findOne({ $or: [{ email }, { username }] });
   if (!patient) {
       throw new ApiError(404, 'User not found');
   }

   const isPasswordCorrect = await patient.isPasswordCorrect(password);
   if (!isPasswordCorrect) {
       throw new ApiError(401, 'Invalid password');
   }

   const { accessToken, refreshToken } = await generateTokens(patient._id);
   const loggedInPatient = await Patient.findById(patient._id).select('-password -refreshToken');

   const options = {
       httpOnly: true,
       secure: true
   };

   res.status(200)
      .cookie('refreshToken', refreshToken, options)
      .cookie('accessToken', accessToken, options)
      .json(new Response(200, { patient: loggedInPatient }, 'Patient logged in successfully'));
});

// Patient logout
export const logoutPatient = asyncWrapper(async (req, res) => {
   const userId = req.user._id;

   await Patient.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }, { new: true });

   const options = { httpOnly: true, secure: true };

   res.status(200)
      .clearCookie('refreshToken', options)
      .clearCookie('accessToken', options)
      .json(new Response(200, {}, 'Patient logged out successfully'));
});

// Get current patient
export const getCurrPatient = asyncWrapper(async (req, res) => {
   const userId = req?.user?._id;
   if (!userId) {
       throw new ApiError(400, 'User ID is required');
   }

   const patient = await Patient.findById(userId).select('-password -refreshToken');
   if (!patient) {
       throw new ApiError(404, 'User not found');
   }

   res.status(200).json(new Response(200, patient, 'Patient profile retrieved successfully'));
});
