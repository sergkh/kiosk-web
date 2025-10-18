import type { NextFunction, Request, Response } from 'express';
import {param, body, validationResult, matchedData } from 'express-validator';

type ValidationRequest = Request & {
  validatedBody?: any
}

export const rejectInvalid = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    (req as ValidationRequest).validatedBody = matchedData(req)
    return next()  
  }
  
  console.log("Invalid request: ", errors.array())

  return res.status(422).json({ errors: errors.array() })
}

export const validateCategory = [
  param('category')
    .isIn(['students', 'abiturients', 'faculties', 'news'])
    .withMessage('Invalid category')
];

export const validatePublished = [
  body('published')
    .isBoolean()
    .withMessage('Published must be a boolean value')
]

export const validateOrderRequest = [
  body('order')
    .isArray()
    .withMessage('Order must be an array of card IDs')    
    .custom((value) => {
      if (value.length === 0) {
        throw new Error('Order array cannot be empty');
      }
      return true;
    })
];