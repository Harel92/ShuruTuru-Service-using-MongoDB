// const fs = require('fs');
const Tour = require('../models/tour');
const Guide = require('../models/guide');

module.exports = {
    //READ guide
    read_guides: (req, res) => {

        const guideId = req.params["id"];
        if(guideId == undefined){
        
            Guide.find().then(guide =>
                res.send(guide)
            ).catch(e => res.status(500).send())
        }
        else
        {
            Guide.findById(guideId).then(guide =>
                res.send(guide)
            ).catch(e => res.status(500).send())
        }
    },

    //READ tour
    read_tour: (req, res) => {

        let choice
        let sortOrder
        const tourId = req.params["id"];

        //Requesting for all tours 
        if(tourId == undefined){

            for (const key in req.query) {
                choice = JSON.parse(key).choice
                sortOrder = JSON.parse(key).sortOrder
            }
    
            let criteria = sortOrder ? -1 : 1
            let my_sort
    
            //Define the filter parameters
            switch (choice) {
                case "Tour name":
                    my_sort = { "tour_name" : criteria }
                    break;
                case "Start date":
                    my_sort = { "start_date" : criteria}               
                    break;
                case "Duration":
                    my_sort = { "duration" : criteria}                
                    break;
                case "Tour cost":
                    my_sort = { "cost" : criteria}               
                    break;
            
                default:
                    break;
            }
            //Query to db
            Tour.find().sort(my_sort).then(tour =>
                    res.send(tour)
            ).catch(e => res.status(500).send())
            
        }
        //Requesting for specific tour 
        else
        {
            Tour.findById(tourId).then(tour =>
                { 
                    res.send(tour)
                    
                }).catch(e =>{
                    //Query to db
                    Tour.findOne({ "tour_name" : tourId }).then(tour =>
                        {
                            if(tour == null)
                                res.status(500).send("Tour doesn't exists")
                            else
                                res.send(tour)
                        }).catch(e => res.status(500).send())    
                })
        }
    },
    // CREATE
   create_tour: function (req, res) {

        const tour = new Tour(req.body)
        tour.save().then(tour => {
            res.status(201).send(tour)
        }).catch(e => {
            res.status(400).send(e)
        })
    },

    create_guide: function (req, res) {

        const guide = new Guide(req.body)
        guide.save().then(guide => {
            res.status(201).send(guide)
        }).catch(e => {
            res.status(400).send(e)
        })

    },

    create_site: function (req, res) {

        const tourId = req.params["id"];
        const siteName = req.body.path[0]["name"] 

        if(tourId != undefined)
        {
            Tour.findById(tourId).then(name_of_exists_site =>{
                if(name_of_exists_site)
                {
                    let isExists = false
                    
                    for(let i = 0 ; i < name_of_exists_site.path.length ; i++)
                    {
                        if(name_of_exists_site.path[i]["name"] == siteName)
                            isExists = true
                    }
                    if(isExists) res.status(400).send("Site already exists !") 
                    else{
                        const updates = Object.keys(req.body)
                        const allowedUpdates = ['path', '_id']
                        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
                        
                        if (!isValidOperation) 
                            return res.status(400).send({ error: 'Invalid updates!' })
            
                        Tour.findByIdAndUpdate(tourId, {$push: {path: req.body["path"]}}, { new: true, runValidators: true }).then(tour => {
                            if (!tour) {
                                return res.status(404).send()
                            }
                            res.send(tour)
                        }).catch(e => res.status(400).send(e))
                    }      
                }
                else res.status(404).send()
            })
        }
        //error - id is undefined
        else
            res.status(404).send()
    },

    // UPDATE
    update_tour: function (req, res) {

        const tourId = req.params["id"];

        if(tourId != undefined)
        {
            const updates = Object.keys(req.body)
            const allowedUpdates = ['start_date', 'duration', 'cost']
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

            if (!isValidOperation) 
                return res.status(400).send({ error: 'Invalid updates!' })
            

            Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).then(tour => {
                if (!tour) {
                    return res.status(404).send("Tour does not exists !")
                }
                res.send(tour)
            }).catch(e => res.status(400).send(e))

        }
        //error - id is undefined
        else
            res.status(404).send()

    },

    // DELETE tour
    delete_tour: function (req, res) {
        
        const tourId = req.params["id"];

        Tour.findByIdAndRemove(tourId).then(tour =>
                res.send("Tour deleted successfuly")

            ).catch(e =>{
                //Query to db
                Tour.findOneAndDelete({ "tour_name" : tourId }).then(tour =>
                    {
                        if(tour == null)
                            res.status(500).send("Tour doesn't exists")
                        else
                            res.send("Tour deleted successfuly")
                    }).catch(e => res.status(500).send())    
            })
    },
    // DELETE site
    delete_site: function (req, res) {
        
        const tourId = req.params["id"];
        const site_name = req.body["name"];

        Tour.findOneAndUpdate(
                {'_id' : tourId} ,
                {
                $pull: { 'path':  { name: site_name } }
                },
                {'new': true}
            )
            .then(tour => {
                    if (!tour) {
                        return res.status(404).send()
                    }
                    res.send(tour)
            }).catch(e => res.status(400).send(e))
    }
};