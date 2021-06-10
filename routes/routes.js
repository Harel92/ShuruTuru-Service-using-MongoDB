const express = require('express'),
    userRoutes = require('./tour'); 

var router = express.Router();


router.get('/tours', userRoutes.read_tour); //Get all tours V
router.get('/tours/:id', userRoutes.read_tour); //Get specific tour V
router.get('/guides', userRoutes.read_guides); //Get all guides V
//private
router.get('/guides/:id', userRoutes.read_guides); //Get specific guide V

router.post('/tours', userRoutes.create_tour); //Add new tour V
router.post('/guides', userRoutes.create_guide); //Add new guide V

router.put('/tours/:id', userRoutes.create_site); //Add site V

router.put('/tours/:id', userRoutes.update_tour); //Edit tour V

router.delete('/tours/:id', userRoutes.delete_tour); //Delete tour V
router.delete('/sites/:id', userRoutes.delete_site);  //Delete site s

module.exports = router;