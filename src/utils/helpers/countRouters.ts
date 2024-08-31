import express, { Router, Request, Response, NextFunction } from 'express';

export function countRoutes(router: Router): number {
  return router.stack.reduce((count: number, middleware) => {
    if (middleware.route) {
      // Contar rutas definidas
      count += 1;
    } else if (middleware.name === 'router' && middleware.handle) {
      // Contar sub-routers (si es necesario)
      count += (middleware.handle as Router).stack.reduce(
        (subCount: number, subMiddleware) => {
          if (subMiddleware.route) {
            subCount += 1;
          }
          return subCount;
        },
        0
      );
    }
    return count;
  }, 0);
}
