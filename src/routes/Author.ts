import express from 'express'
import controller from '../controller/Author'
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema'

const router = express.Router()

router.post('/create',ValidateSchema(Schemas.author.create),controller.createAuthor)
router.get('/get/:authorId',controller.readAuthor)
router.get('/get/',controller.readAllAuthor)
router.patch('/update/:authorId',ValidateSchema(Schemas.author.update),controller.updateAuthor)
router.delete('/delete/:authorId',controller.deleteAuthor)


export = router