import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';

const router = Router();
const profileController = new ProfileController();



router.get('/:slug', profileController.one);
router.get('/:slug/settings', profileController.settings);
router.get('/:slug/companies', profileController.companies);
router.get('/:slug/album', profileController.album);

// router.get('/:slug/activity', );
// router.get('/:slug/companies', );
// router.get('/:slug/album', );
// router.get('/:slug/album/:id', );
// router.get('/:slug/album/profile', );
// router.get('/:slug/settings', );
// router.get('/:slug/album/profile?limit=ture', );
// router.get('/lookups', );
// /${slug}/friends?query=${searchValue}
// /${slug}/activity/bookmark
// /${slug}/friends-request
// /${slug}/friends
// /${slug}/audio
// /${slug}/video
// 
//


/**
 * Post
 */

// router.post('/:slug/hobbies')

// router.post('/:slug/social', );
// router.post('/:slug/companies', );
// router.post('/:slug/training', );
// router.post('/:slug/album', );
// router.post('/:slug/album/image', );
// router.post('/:slug/social', );
// router.post('/:user/switch', );


// router.patch('/:slug/settings', );


// default

router.get('/', profileController.all);
// router.post('/:id', userController.add);

// router.patch('/:slug/update', userController.remove);

router.delete('/:id', profileController.remove);

export default router;
