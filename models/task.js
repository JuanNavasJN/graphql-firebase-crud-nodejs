const { database } = require('../services/firebase');

// Create a task
const task = function(input) {
    this.save = function() {
        return new Promise(resolve => {
            database
                .ref('tasks')
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
task.findTaskById = id => {
    return new Promise(resolve => {
        database
            .ref('tasks')
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
task.getAllTasks = () => {
    return new Promise(resolve => {
        database
            .ref('tasks')
            .orderByKey()
            .once('value')
            .then(res => {
                if (res.val()) {
                    // console.log(res.val());
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

task.updateTask = task =>
    new Promise(resolve => {
        database
            .ref('tasks/' + task.id)
            .set({
                description: task.description
                // users: task.users
            })
            .then(res => resolve())
            .catch(error => {
                console.log('error', error);
            });
    });

task.addUserToTask = args =>
    new Promise(resolve => {
        // console.log(args);
        database
            .ref('tasks/' + args.id + '/users')
            .push(args.userid)
            .then(res => {
                resolve();
            })
            .catch(error => {
                console.log('error', error);
            });
    });

module.exports = task;
