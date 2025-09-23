import { Router } from 'express';
import * as hostaway from '../controllers/hostaway.controller.js';
import * as properties from '../controllers/properties.controller.js';
import * as reviews from '../controllers/reviews.controller.js';
import * as pub from '../controllers/public.controller.js';

const r = Router();

// Hostaway ingest/normalize
r.get('/reviews/hostaway', hostaway.fetchNormalize);

// Properties
r.get('/properties', properties.list);
r.get('/properties/:id/kpis', properties.kpis);
r.get('/properties/:id/trends', properties.trends);

// Reviews (dashboard)
r.get('/reviews', reviews.list);
r.patch('/reviews/:id', reviews.patch);
r.post('/reviews/:id/response', reviews.createResponse);

// Public website
r.get('/public/properties/:id/reviews', pub.approvedReviews);
r.get('/public/properties/:idOrSlug', pub.propertyDetails);


export default r;
