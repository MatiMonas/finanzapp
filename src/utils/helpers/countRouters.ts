import express, { Router, Request, Response, NextFunction } from 'express';

export function countRoutes(router: Router): number {
  return router.stack.reduce((count: number, middleware) => {
    if (middleware.route) {
      count += 1;
    }
    return count;
  }, 0);
}
