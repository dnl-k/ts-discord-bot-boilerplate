import { Application } from 'express';
import { PathLike } from 'fs';
import { Middleware, Resource, Route, RouteOptions, predicate } from './types.js';
import { readdir, stat } from 'fs/promises';
import path from 'path';

export default class Router {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async load(dir: PathLike): Promise<boolean> {
    const statDir = await stat(dir);
    if (!statDir.isDirectory()) {
      throw new Error(`${dir} is not a directory`);
    }

    const files = await readdir(dir, {
      recursive: true
    });

    for (const file of files) {
      if (!file.endsWith('.js')) {
        continue;
      }
      const filePath = new URL(`${dir}/${file}`);
      const statFile = await stat(filePath);

      if (!statFile.isFile()) continue;

      const route = (await import(`${dir}/${file}`)).default;

      if (!predicate(route)) continue;
      const path = this.constructPath(file);
      const middleware = route.middleware;

      for (const [method, handler] of Object.entries(route)) {
        if (method === 'middleware') continue;
        this.app[method](path, ...this.combine(middleware, handler));
        console.log(`${method.toUpperCase().padEnd(5)} => ${path}`);
      }
    }
    return true;
  }

  /**
   * Build the API path
   * @param filePath Part of the file path
   * @returns 
   */
  private constructPath(filePath: string): string {
    const url = '/' + filePath.replace('.ts', '')
      .replace('.js', '')
      .replace('index', '');

    if (url.length === 1) return url;
    return url.split(path.sep)
      .map((part) => this.replaceParamsToken(part))
      .join('/');
  }

  /**
   * 
   * @param token 
   * @returns 
   */
  private replaceParamsToken(token: string): string {
    const regex = /{.+}/g;
    let result;
    while ((result = regex.exec(token)) !== null) {
      token = token.substring(0, result.index) + result[0].replace('{', ':')
        .replace('}', '') + token.substr(result.index + result[0].length);
    }
    return token;
  }

  /**
   * Combines the middleware(s) with the handler function into one array
   * @param middleware 
   * @param routeOptions 
   * @returns 
   */
  private combine(middleware: undefined | Middleware | Middleware[], routeOptions) {
    const routeMiddleware: Middleware[] =
      middleware === undefined ? [] : Array.isArray(middleware) ? middleware : [middleware];

    if (typeof routeOptions === 'function') {
      return [...routeMiddleware, routeOptions];
    } else {
      routeOptions.middleware = routeOptions.middleware === undefined ? [] : routeOptions.middleware;
      if (Array.isArray(routeOptions.middleware)) {
        return [ ...routeMiddleware, ...routeOptions.middleware, routeOptions.handler ];
      } else {
        return [...routeMiddleware, routeOptions.middleware, routeOptions.handler];
      }
    }
  }
}