const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Pangolin = mongoose.model('Pangolin');

router.get('/', (req, res) => {
    res.render("pangolin/addOrEdit", {
        viewTitle: "Insert Pangolin"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var pangolin = new Pangolin();
    pangolin.fullName = req.body.fullName;
    pangolin.email = req.body.email;
    pangolin.rank = req.body.rank;
    pangolin.save((err, doc) => {
        if (!err)
            res.redirect('pangolin/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("pangolin/addOrEdit", {
                    viewTitle: "Insert Pangolin",
                    pangolin: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Pangolin.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('pangolin/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("pangolin/addOrEdit", {
                    viewTitle: 'Update Pangolin',
                    pangolin: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Pangolin.find((err, docs) => {
        if (!err) {
            res.render("pangolin/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving pangolin list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Pangolin.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("pangolin/addOrEdit", {
                viewTitle: "Update Pangolin",
                pangolin: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Pangolin.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/pangolin/list');
        }
        else { console.log('Error in pangolin delete :' + err); }
    });
});

module.exports = router;