import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response
} from "express";
import { type ParamsDictionary, type Query } from "express-serve-static-core";

type AsyncController<
  TParams = ParamsDictionary,
  TResponseBody = unknown,
  TRequestBody = unknown,
  TRequestQuery = Query
> = (
  req: Request<TParams, TResponseBody, TRequestBody, TRequestQuery>,
  res: Response<TResponseBody>,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = <
  TParams = ParamsDictionary,
  TResponseBody = unknown,
  TRequestBody = unknown,
  TRequestQuery = Query
>(
  controller: AsyncController<TParams, TResponseBody, TRequestBody, TRequestQuery>
): RequestHandler<TParams, TResponseBody, TRequestBody, TRequestQuery> => {
  return (req, res, next) => {
    void controller(req, res, next).catch(next);
  };
};
