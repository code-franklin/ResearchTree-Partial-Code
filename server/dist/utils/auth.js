"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
// utils/auth.js
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const ACCESS_KEY = process.env.ACCESS_KEY || 'fhEyIAZQfUaZp0EWjg1F48uyRSqFAYsQwSdvGmHf11RSsjLRiYViPo7zY41V'; // Replace with your actual secret or access key
function generateToken(user) {
    const payload = {
        aud: 'xrFOxf2xvbLZW9SVeF1Y', // Replace with your actual Environment ID
        sub: user._id, // Unique user identifier
        name: user.name,
        email: user.email,
        avatar: user.profileImage // Optional
    };
    return jsonwebtoken_1.default.sign(payload, ACCESS_KEY, { algorithm: 'HS256', expiresIn: '1h' });
}
