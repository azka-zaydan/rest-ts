import Joi,{ObjectSchema} from "joi";
import { Request,Response,NextFunction } from "express";
import Logging from "../library/Logging";
import { IAuthor } from "../models/Author";
import { IBook } from "../models/Book";


export const ValidateSchema = (schema:ObjectSchema) => {
    return async (req:Request,res:Response,next:NextFunction) => {
        try {
            schema.validateAsync(req.body)
            next()
        } catch (error) {
            Logging.error(error)
            return res.status(422).json({error})
        }
    }
}

export const Schemas = {
    author:{
        create:Joi.object<IAuthor>(
            {
                name:Joi.string().required()
            }
        ),
        update:Joi.object<IAuthor>(
            {
                name:Joi.string().required()
            }
        )
    },
    book: {
        create: Joi.object<IBook>({
            author: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            title: Joi.string().required()
        }),
        update: Joi.object<IBook>({
            author: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            title: Joi.string().required()
        })
    }
}