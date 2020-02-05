// import { getRepository } from "typeorm";
// import { NextFunction, Request, Response } from "express";
// import { users_profile } from "../models/users_profile";

// export class UserController {

//     /**
//     * @Get All 
//     */

//     async all(request: Request, response: Response, next: NextFunction) {

//         const userRepository = getRepository(users_profile);
//         try {
//             const data = await userRepository.find();
//             response.status(200).send({ error: false, data: { data } })
//         } catch (error) {
//             response.status(400).send({ error: true, data: error.message })
//         }

//     }

//     /**
//     * @Get One 
//     */

//     async one(request: Request, response: Response, next: NextFunction) {

//         const userRepository = getRepository(users_profile);
//         try {
//             const data = await userRepository.findOne(request.params.id);
//             if (!data) throw new Error('User Not Found');
//             response.status(200).send({ error: false, data: { data } })
//         } catch (error) {
//             response.status(400).send({ error: true, data: error.message })
//         }
//     }

//     /**
//     * @Add One 
//     */

//     async add(request: Request, response: Response, next: NextFunction) {

//         const userRepository = getRepository(users_profile);
//         try {
//             const data = await userRepository.save(request.body);
//             response.status(200).send({ error: false, data: { data } })
//         } catch (error) {
//             response.status(400).send({ error: true, data: error.message })
//         }
//     }

//     /**
//     * @Delete One 
//     */

//     async remove(request: Request, response: Response, next: NextFunction) {

//         const userRepository = getRepository(users_profile);
//         try {
//             let userToRemove = await userRepository.findOne(request.params.id);
//             const data = await userRepository.remove(userToRemove);
//             response.status(200).send({ error: false, data: { data } })
//         } catch (error) {
//             response.status(400).send({ error: true, data: error.message })
//         }
//     }

// }