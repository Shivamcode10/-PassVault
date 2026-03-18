import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { AppError } from './errorHandler';

export interface ValidationRule {
  field: string;
  rules: string[];
  message?: string;
}

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: any = {};

    for (const rule of rules) {
      const value = req.body[rule.field];
      
      for (const validation of rule.rules) {
        const [ruleName, ...args] = validation.split(':');

        switch (ruleName) {
          case 'required':
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              errors[rule.field] = rule.message || `${rule.field} is required`;
            }
            break;

          case 'email':
            if (value && !validator.isEmail(value)) {
              errors[rule.field] = rule.message || `${rule.field} must be a valid email`;
            }
            break;

          case 'min':
            if (value && value.length < parseInt(args[0])) {
              errors[rule.field] = rule.message || `${rule.field} must be at least ${args[0]} characters`;
            }
            break;

          case 'max':
            if (value && value.length > parseInt(args[0])) {
              errors[rule.field] = rule.message || `${rule.field} must not exceed ${args[0]} characters`;
            }
            break;

          case 'strong':
            if (value && !validator.isStrongPassword(value, {
              minLength: 8,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 0
            })) {
              errors[rule.field] = rule.message || `${rule.field} must contain at least 8 characters, including uppercase, lowercase, and numbers`;
            }
            break;

          case 'url':
            if (value && !validator.isURL(value)) {
              errors[rule.field] = rule.message || `${rule.field} must be a valid URL`;
            }
            break;

          case 'alpha':
            if (value && !validator.isAlpha(value)) {
              errors[rule.field] = rule.message || `${rule.field} must contain only letters`;
            }
            break;

          case 'alphanumeric':
            if (value && !validator.isAlphanumeric(value)) {
              errors[rule.field] = rule.message || `${rule.field} must contain only letters and numbers`;
            }
            break;

          case 'matches':
            const [fieldToMatch] = args;
            if (value !== req.body[fieldToMatch]) {
              errors[rule.field] = rule.message || `${rule.field} must match ${fieldToMatch}`;
            }
            break;

          case 'in':
            const allowedValues = args[0].split(',');
            if (value && !allowedValues.includes(value)) {
              errors[rule.field] = rule.message || `${rule.field} must be one of: ${allowedValues.join(', ')}`;
            }
            break;

          case 'optional':
            // Skip validation if field is not present
            if (!value) {
              continue;
            }
            break;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return next(new AppError(`Validation failed: ${JSON.stringify(errors)}`, 400));
    }

    next();
  };
};

// Validation schemas
export const authValidation = {
  register: validate([
    { field: 'name', rules: ['required', 'min:2', 'max:50'] },
    { field: 'email', rules: ['required', 'email'] },
    { field: 'password', rules: ['required', 'min:6', 'strong'] },
    { field: 'masterPassword', rules: ['optional', 'min:8'] },
  ]),

  login: validate([
    { field: 'email', rules: ['required', 'email'] },
    { field: 'password', rules: ['required'] },
  ]),

  updateProfile: validate([
    { field: 'name', rules: ['optional', 'min:2', 'max:50'] },
    { field: 'email', rules: ['optional', 'email'] },
    { field: 'avatar', rules: ['optional', 'url'] },
  ]),

  changePassword: validate([
    { field: 'currentPassword', rules: ['required'] },
    { field: 'newPassword', rules: ['required', 'min:6', 'strong'] },
  ]),

  setMasterPassword: validate([
    { field: 'masterPassword', rules: ['required', 'min:8'] },
    { field: 'confirmPassword', rules: ['required', 'matches:masterPassword'] },
  ]),
};

export const passwordValidation = {
  create: validate([
    { field: 'website', rules: ['required', 'min:2', 'max:100'] },
    { field: 'username', rules: ['required', 'min:2', 'max:100'] },
    { field: 'password', rules: ['required', 'min:4'] },
    { field: 'category', rules: ['required', 'in:Personal,Work,Finance,Shopping,Social Media,Development,Other'] },
    { field: 'url', rules: ['optional', 'url'] },
    { field: 'notes', rules: ['optional', 'max:500'] },
    { field: 'tags', rules: ['optional'] },
    { field: 'isFavorite', rules: ['optional', 'in:true,false'] },
  ]),

  update: validate([
    { field: 'website', rules: ['optional', 'min:2', 'max:100'] },
    { field: 'username', rules: ['optional', 'min:2', 'max:100'] },
    { field: 'password', rules: ['optional', 'min:4'] },
    { field: 'category', rules: ['optional', 'in:Personal,Work,Finance,Shopping,Social Media,Development,Other'] },
    { field: 'url', rules: ['optional', 'url'] },
    { field: 'notes', rules: ['optional', 'max:500'] },
    { field: 'tags', rules: ['optional'] },
    { field: 'isFavorite', rules: ['optional', 'in:true,false'] },
  ]),
};