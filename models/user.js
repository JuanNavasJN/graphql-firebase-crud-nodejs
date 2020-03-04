const { database } = require('../services/firebase');

// Create a user
const user = function(input) {
    this.save = function() {
        return new Promise(resolve => {
            database
                .ref('users')
                .push(input)
                .then(res => {
                    resolve(Object.assign({ id: res.key }, input));
                })
                .catch(error => {
                    console.log('error', error);
                });
        });
    };
};
user.findUserById = id => {
    return new Promise(resolve => {
        database
            .ref('users')
            .orderByKey()
            .equalTo(id)
            .once('value')
            .then(res => {
                resolve(Object.assign({ id: id }, res.val()[id]));
            })
            .catch(error => {
                console.log('error', error);
            });
    });
};
user.getAllUsers = () => {
    return new Promise(resolve => {
        database
            .ref('users')
            .orderByKey()
            .once('value')
            .then(res => {
                if (res.val()) {
                    resolve(
                        Object.keys(res.val()).map(key =>
                            Object.assign({ id: key }, res.val()[key])
                        )
                    );
                } else {
                    resolve(null);
                }
            })
            .catch(error => {
                console.log('error', error);
            });
    });
};

module.exports = user;
