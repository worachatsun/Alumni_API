const Career = require('mongoose').model('career')
const mongoose = require('mongoose')

exports.createCareer = function(req, res, next) {
    let career_name = req.body.career_name
    let career_description = req.body.career_description
    let qualification = req.body.qualification
    let company = req.body.company
    let capacity = req.body.capacity
    let salary = req.body.salary
    let created_by_id = req.body.created_by_id
    let created_by_name = req.body.created_by_name
    let picture = req.body.picture
    let position = req.body.position

    if (!career_name || !position || !career_description || !qualification || !company || !created_by_id || !created_by_name) {
        return res.status(422).json({error: "You must provide an data"})
    }

    let career = new Career({
        career_name,
        career_description,
        assets: {
            picture
        },
        capacity,
        position,
        qualification,
        company,
        salary,
        created_by: {
            _id: created_by_id,
            name: created_by_name
        }
    })

    career.save(function(err) {
        if (err) {return next(err)}
        res.json({career})
    })

}

exports.getCareer = function(req, res, next) {
    let limit = req.params.offset || 0
    let offset = req.params.limit || 10
    Career.find({}, {}, { skip: parseInt(req.params.offset), limit: parseInt(req.params.limit) }, function(err, career){
        if(err) {return next(err)}
        res.json(career)
    }).sort({created_at: 'desc'})
}

exports.getAllCareer = function(req, res, next) {
    Career.find({}, function(err, career) {
        if (err) {
            return next(err)
        } else {
            res.json(career)
        }
    }).sort({created_at: 'desc'})
}