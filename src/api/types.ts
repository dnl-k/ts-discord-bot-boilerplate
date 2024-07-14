import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

type StructurePredicate<T> = (structure: unknown) => structure is T;

export interface Middleware {
  <T>(req: Request & T, res: Response, next: NextFunction): void
}

export type Route = (request: Request, response: Response) => any

type MiddlewareRoute = {
  middleware: Middleware | Middleware[];
  handler: Route;
}

export type RouteOptions = Route | MiddlewareRoute;

export type Resource = {
	middleware?: Middleware | Middleware[];
  delete?: RouteOptions;
  get?: RouteOptions;
  head?: RouteOptions;
  patch?: RouteOptions;
  post?: RouteOptions;
  put?: RouteOptions;
  options?: RouteOptions;
};

export const schema = z.object({
  middleware: z.function().optional(),
  delete: z.function().optional(),
  get: z.function().optional(),
  head: z.function().optional(),
  patch: z.function().optional(),
  post: z.function().optional(),
  put: z.function().optional(),
  options: z.function().optional(),
});

export const predicate: StructurePredicate<Resource> = (structure: unknown): structure is Resource =>
	schema.safeParse(structure).success;