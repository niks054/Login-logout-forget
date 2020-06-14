const jwt = require('jsonwebtoken')
const JWTsecret = require('../config/keys').JWTsecret;
const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token)
            return res
                .status(401)
                .json({ msg: 'No auth token,authorization denied' })

        const verified = jwt.verify(token, JWTsecret);
        if (!verified)
            return res
                .status(401)
                .json({ msg: 'No auth token,authorization denied' })
        req.user = verified.id;
        next();
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }

}
module.exports = auth;