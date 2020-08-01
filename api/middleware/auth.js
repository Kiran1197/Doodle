const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var userName;
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[0];
    const decoded = jwt.verify(token, 'MY_SECRET_KEY');
    const encryptedUsername=req.headers.authorization.split(' ')[1];
    userName=decoded.uname;
    req.body.customerID=userName;
    bcrypt.compare(decoded.uname,encryptedUsername,(err, result) => {
      if (err) {
          res.status(401).json({
              message: 'Auth Failed'
          });
      }
      else if (result) {
        next();
    }
      else
        {
          res.status(401).json({
            message: 'Auth Failed'
        });
        }
   })
}
catch (error) {
  res.status(401).json({
    message: 'Auth failed',
  });
}
};




function sendUser() {
  return userName;
}

