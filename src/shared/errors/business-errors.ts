/* eslint-disable prettier/prettier */

export function BusinessLogicException(message: string, type: number) {
    this.message = message;
    this.type = type;
  }
  
  export enum BusinessError {
    NOT_FOUND = 404,
    UNEXPECTEDERROR = 500,
    PRECONDITION_FAILED = 412
  }
  /* archivo: src/shared/errors/business-errors.ts */