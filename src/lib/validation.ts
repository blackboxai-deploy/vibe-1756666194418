import { z } from 'zod';
import { USER_ROLES, VEHICLE_TYPES, PAYMENT_METHODS, VALIDATION } from '@/lib/constants';

// Auth validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .min(VALIDATION.email.minLength, `Email must be at least ${VALIDATION.email.minLength} characters`)
    .max(VALIDATION.email.maxLength, `Email must not exceed ${VALIDATION.email.maxLength} characters`),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION.password.minLength, `Password must be at least ${VALIDATION.password.minLength} characters`)
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .min(VALIDATION.email.minLength, `Email must be at least ${VALIDATION.email.minLength} characters`)
    .max(VALIDATION.email.maxLength, `Email must not exceed ${VALIDATION.email.maxLength} characters`),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION.password.minLength, `Password must be at least ${VALIDATION.password.minLength} characters`)
    .max(VALIDATION.password.maxLength, `Password must not exceed ${VALIDATION.password.maxLength} characters`)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  name: z
    .string()
    .min(1, 'Name is required')
    .min(VALIDATION.name.minLength, `Name must be at least ${VALIDATION.name.minLength} characters`)
    .max(VALIDATION.name.maxLength, `Name must not exceed ${VALIDATION.name.maxLength} characters`)
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || VALIDATION.phone.pattern.test(val), 'Invalid phone number format'),
  role: z.enum([USER_ROLES.PASSENGER, USER_ROLES.DRIVER, USER_ROLES.ADMIN])
});

// Profile validation schemas
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.name.minLength, `Name must be at least ${VALIDATION.name.minLength} characters`)
    .max(VALIDATION.name.maxLength, `Name must not exceed ${VALIDATION.name.maxLength} characters`)
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || VALIDATION.phone.pattern.test(val), 'Invalid phone number format'),
  profilePicture: z.string().url('Invalid profile picture URL').optional()
});

// Ride validation schemas
export const locationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90, 'Invalid latitude'),
    lng: z.number().min(-180).max(180, 'Invalid longitude')
  }),
  placeId: z.string().optional()
});

export const rideRequestSchema = z.object({
  pickup: locationSchema,
  destination: locationSchema,
  vehicleType: z.enum([
    VEHICLE_TYPES.STANDARD,
    VEHICLE_TYPES.PREMIUM,
    VEHICLE_TYPES.XL,
    VEHICLE_TYPES.LUXURY
  ]),
  paymentMethod: z.enum([
    PAYMENT_METHODS.CREDIT_CARD,
    PAYMENT_METHODS.DEBIT_CARD,
    PAYMENT_METHODS.DIGITAL_WALLET,
    PAYMENT_METHODS.CASH
  ]),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional()
});

export const rideRatingSchema = z.object({
  rideId: z.string().min(1, 'Ride ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must not exceed 5'),
  comment: z.string().max(1000, 'Comment must not exceed 1000 characters').optional()
});

// Vehicle validation schema (for drivers)
export const vehicleInfoSchema = z.object({
  make: z.string().min(1, 'Vehicle make is required'),
  model: z.string().min(1, 'Vehicle model is required'),
  year: z.number().min(1990, 'Vehicle year must be 1990 or later').max(new Date().getFullYear() + 1, 'Invalid vehicle year'),
  color: z.string().min(1, 'Vehicle color is required'),
  licensePlate: z.string().min(1, 'License plate is required').regex(/^[A-Z0-9\-\s]{2,10}$/i, 'Invalid license plate format'),
  type: z.enum([
    VEHICLE_TYPES.STANDARD,
    VEHICLE_TYPES.PREMIUM,
    VEHICLE_TYPES.XL,
    VEHICLE_TYPES.LUXURY
  ])
});

export const driverProfileSchema = z.object({
  licenseNumber: z.string().min(1, 'Driver license number is required'),
  vehicleInfo: vehicleInfoSchema
});

// Payment validation schemas
export const paymentMethodSchema = z.object({
  type: z.enum([
    PAYMENT_METHODS.CREDIT_CARD,
    PAYMENT_METHODS.DEBIT_CARD,
    PAYMENT_METHODS.DIGITAL_WALLET,
    PAYMENT_METHODS.CASH
  ]),
  details: z.record(z.any()).optional()
});

// Search and filter schemas
export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must not exceed 100').default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
});

export const dateRangeSchema = z.object({
  start: z.date(),
  end: z.date()
}).refine((data) => data.start <= data.end, 'Start date must be before end date');

// AI request validation
export const aiRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(4000, 'Prompt must not exceed 4000 characters'),
  context: z.record(z.any()).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional()
});

// Export types for use in components
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type RideRequestData = z.infer<typeof rideRequestSchema>;
export type RideRatingData = z.infer<typeof rideRatingSchema>;
export type VehicleInfoData = z.infer<typeof vehicleInfoSchema>;
export type DriverProfileData = z.infer<typeof driverProfileSchema>;
export type PaymentMethodData = z.infer<typeof paymentMethodSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
export type AIRequestData = z.infer<typeof aiRequestSchema>;