const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./../models/user");

exports.signup_user = (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(users => {
            console.log(users.length);
            if (users.length >= 1) {
                return res.status(409).json({
                    message: "Username already exists"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.json({
                            error: err
                           
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User Created"
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.user_login = (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            var uname=req.body.username;
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                console.log(user);
                if (err) {
                    res.status(401).json({
                        message: 'Auth Failed'
                    });
                }
                if (result) {
                    const token=jwt.sign({uname},'MY_SECRET_KEY',{expiresIn:'1d'});
                    res.status(200).json({
                        message: 'Auth Successful',
                        token: token
                    });
                } else {
                    res.status(401).json({
                        message: 'Auth Failed'
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

// exports.delete_user = (req, res, next) => {
//     User.remove({ _id: req.params.userId })
//         .exec()
//         .then(result => {
//             res.status(200).json({
//                 message: "User deleted successfully"
//             })
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// }