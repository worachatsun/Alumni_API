const Donation = require('mongoose').model('donation')
const mongoose = require('mongoose')

exports.createDonation = function(req, res, next) {
    const { project_description, project_name, picture, ways_to_donate, created_by } = req.body
    console.log(req.body)

    if (!project_name || !project_description || !picture || !created_by) {
        return res.status(422).json({error: "You must provide an data"})
    }

    let donation = new Donation({
        project_name,
        project_description,
        picture,
        ways_to_donate,
        created_by
    })

    donation.save(function(err) {
        if (err) {return next(err)}
        res.json({donation})
    })

}

exports.getDonation = function(req, res, next) {
    let limit = req.params.offset || 0
    let offset = req.params.limit || 10
    Donation.find({}, {}, { skip: parseInt(req.params.offset), limit: parseInt(req.params.limit) }, function(err, data){
        if(err) {return next(err)}
        res.json(data)
    }).sort({created_at: 'desc'})
}

exports.getAllDonation = function(req, res, next) {
    Donation.find({}, function(err, donation) {
        if (err) {
            return next(err)
        } else {
            res.json(donation)
        }
    }).sort({created_at: 'desc'})
}

exports.getDonationById = function(req, res, next) {
    Donation.findById(req.params.id, function(err, donate) {
        if (err) {  
            return next(err)
        } else {
            return res.json(donate)
        }
    })
}

exports.editDonation = function(req, res, next) {
    const { _id, project_description, project_name } = req.body
    Donation.findByIdAndUpdate(_id, {$set: {project_description, project_name}}, {new: true}, (err, donate) => {
        console.log(donate)
    })
}