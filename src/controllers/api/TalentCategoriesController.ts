import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { TalentCategories } from '../../models/newModels/talent_categories';
import { transformAndValidate } from 'class-transformer-validator';


export class TalentCategoriesController {

    /**
    * @Get All
    */

    async getAllTalentCategories(request: Request, response: Response, next: NextFunction) {

        const talentRepository = getRepository(TalentCategories);
        try {
            const data = await talentRepository.find();
            return response.status(200).send(data);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }

    /**
     * @Dashboard add new talent categories
     * @Post
     */
    async createNewCategory(request: Request, response: Response, next: NextFunction) {

        const talentRepository = getRepository(TalentCategories);
        try {
            const validateBody = await transformAndValidate(TalentCategories, request.body);

            const enNameExist = await talentRepository.findOne({ name_en: request.body.name_en });
            const arNameExist = await talentRepository.findOne({ name_ar: request.body.name_ar });
            if (enNameExist) { throw new Error('name_en already exist'); }
            if (arNameExist) { throw new Error('name_ar already exist'); }

            const newCategory = new TalentCategories();
            Object.assign(newCategory, validateBody);
            const data = await talentRepository.save(newCategory);

            return response.status(200).send(data);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }

    }
}