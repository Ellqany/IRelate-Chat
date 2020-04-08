// import dotenv from 'dotenv';

function wrapAsync(callback) {
    return function (req, res, next) {
        callback(req, res, next).catch(e => {
            next(e);
        });
    };
}

exports.wrapAsync = wrapAsync;