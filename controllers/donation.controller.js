const Donation = require('mongoose').model('donation')
const mongoose = require('mongoose')

exports.createDonation = function(req, res, next) {
    let project_name = req.body.project_name
    let project_description = req.body.project_description
    let picture = req.body.picture
    let how_to = req.body.how_to
    let created_by = req.body.created_by

    if (!project_name || !project_description || !picture || !created_by) {
        return res.status(422).json({error: "You must provide an data"})
    }

    let donation = new Donation({
        project_name,
        project_description,
        picture,
        donate: {
            how_to,
        },
        created_by
    })

    donation.save(function(err) {
        if (err) {return next(err)}
        res.json({donation})
    })

}