import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { HeightRangeLookup } from '../../models/newModels/height_range_lookup';
import { WeightRangeLookup } from '../../models/newModels/weight_range_lookup';
import { BuildLookup } from '../../models/newModels/build_lookup';
import { HairLookup } from '../../models/newModels/hair_lookup';
import { EyeLookup } from '../../models/newModels/eye_lookup';
import { EthnicitiesLookup } from '../../models/newModels/ethnicities_lookup';
import { Hobbies } from '../../models/newModels/profile_hobbies';
import { TalentCategories } from '../../models/newModels/talent_categories';

function identifyLookupRepo(lookupString) {
    if (lookupString == 'height') { return HeightRangeLookup; }
    else if (lookupString == 'weight') { return WeightRangeLookup; }
    else if (lookupString == 'build') { return BuildLookup; }
    else if (lookupString == 'hair') { return HairLookup; }
    else if (lookupString == 'eye') { return EyeLookup; }
    else if (lookupString == 'ethnicitie') { return EthnicitiesLookup; }
    else if (lookupString == 'hobby') { return Hobbies; }
    else if (lookupString == 'talent') { return TalentCategories; }
    else { return ''; }
}

export class AdminLookupsController {
    // i will make a temlate for get all, get one , update delete , for all lookups
    async getAllTemplate(request: Request, response: Response, next: NextFunction) {
        try {
            const { lookupRepo } = request.params;
            const repo = identifyLookupRepo(lookupRepo);
            const LookupRepository = getRepository(repo);
            const [data, count] = await LookupRepository.findAndCount({ order: { id: 'DESC' } });
            return response.status(200).send({ data, count });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async getOneTemplate(request: Request, response: Response, next: NextFunction) {
        try {
            const { lookupRepo } = request.params;
            const repo = identifyLookupRepo(lookupRepo);
            const LookupRepository = getRepository(repo);
            const data = await LookupRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!data) { throw new Error('given id not found'); }
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async createNewTemplate(request: Request, response: Response, next: NextFunction) {
        try {
            const { lookupRepo } = request.params;
            if (!request.body.name) { throw new Error('name is required'); }
            const repo = identifyLookupRepo(lookupRepo);
            const LookupRepository = getRepository(repo);
            let item;
            switch (lookupRepo) {
                case 'height':
                    item = new HeightRangeLookup();
                    break;
                case 'weight':
                    item = new WeightRangeLookup();
                    break;
                case 'build':
                    item = new BuildLookup();
                    break;
                case 'hair':
                    item = new HairLookup();
                    break;
                case 'eye':
                    item = new EyeLookup();
                    break;
                case 'ethnicitie':
                    item = new EthnicitiesLookup();
                    break;
                case 'hobby':
                    item = new Hobbies();
                    break;
                case 'talent':
                    item = new TalentCategories();
                    break;
                default:
                    item = '';
                    break;
            }
            if (lookupRepo !== 'talent') {
                item.name = request.body.name;
            } else {
                item.name_en = request.body.name_en;
                item.name_ar = request.body.name_ar;
            }
            const data = await LookupRepository.save(item);
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async updateOneTemplate(request: Request, response: Response, next: NextFunction) {
        try {
            const { lookupRepo } = request.params;
            const repo = identifyLookupRepo(lookupRepo);
            const LookupRepository = getRepository(repo);
            const find = await LookupRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!find) { throw new Error('given id not found'); }

            await LookupRepository.update({ id: parseInt(request.params.id, 10) }, request.body)
            const data = await LookupRepository.findOne({ id: parseInt(request.params.id, 10) });
            return response.status(200).send({ data });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
    async deleteOneTemplate(request: Request, response: Response, next: NextFunction) {
        try {
            const { lookupRepo } = request.params;
            const repo = identifyLookupRepo(lookupRepo);
            const LookupRepository = getRepository(repo);
            const find = await LookupRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!find) { throw new Error('given id not found'); }
            await LookupRepository.delete({ id: parseInt(request.params.id, 10) })
            return response.status(200).send({ data: find });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }
}
