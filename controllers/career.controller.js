const Career = require('mongoose').model('career')
const mongoose = require('mongoose')

exports.createCareer = function(req, res, next) {
    const { 
        career_name, 
        career_description, 
        qualification, 
        company, 
        capacity, 
        salary, 
        picture, 
        created_by, 
        position, 
        expiry_date,
        career_owner_surname,
        career_owner_name,
        career_owner_tel,
        career_owner_facebook,
        career_owner_line,
        career_owner_email
     } = req.body
    console.log(req.body)

    if (!career_name || !career_description || !qualification || !company || !created_by) {
        return res.status(422).json({error: "You must provide an data"})
    }

    let career = new Career({
        career_name,
        career_description,
        picture,
        capacity,
        position,
        qualification,
        company,
        salary,
        created_by,
        expiry_date,
        career_owner: {
            name: career_owner_name,
            surname: career_owner_surname,
            phone: career_owner_tel,
            email: career_owner_email,
            facebook: career_owner_facebook,
            line: career_owner_line
        },
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

exports.getCareerById = function(req, res, next) {
    Career.findById(req.params.id, function(err, career) {
        if (err) {  
            return next(err)
        } else {
            return res.json(career)
        }
    })
}

exports.editCareer = function(req, res, next) {
    const { 
        _id, 
        career_description, 
        expiry_date, 
        career_name, 
        company, 
        position, 
        qualification, 
        salary,
        career_owner_surname,
        career_owner_name,
        career_owner_tel,
        career_owner_facebook,
        career_owner_line,
        career_owner_email,
        picture
    } = req.body
    Career.findByIdAndUpdate(_id, {$set: {picture, career_description, expiry_date, career_name, company, position, qualification, salary,
            career_owner: {name: career_owner_name, surname: career_owner_surname, phone: career_owner_tel, line: career_owner_line, facebook: career_owner_facebook, email: career_owner_email}}}, {new: true}, (err, career) => {
        if (err) {  
            return next(err)
        } else {
            return res.json(career)
        }
    })
}

exports.removeCareer = function(req, res) {
    const { array_id } = req.body
    Career.remove({_id: {$in: array_id}}, function(err) {
        if (err) { return next(err) }
        return res.json({ status: 'success' })
    })
}