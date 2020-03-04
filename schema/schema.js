const {
    GraphQLSchema,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require('graphql');

const Task = require('../models/task');
const User = require('../models/user');

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        description: { type: GraphQLString },
        users: { type: GraphQLList(GraphQLID) }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        task: {
            type: TaskType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Task.findTaskById(args.id);
            }
        },
        tasks: {
            type: GraphQLList(TaskType),
            async resolve(parent, args) {
                return await Task.getAllTasks();
            }
        },
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return User.findUserById(args.id);
            }
        },
        users: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                return User.getAllUsers();
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    email: args.email
                });
                return user.save();
            }
        },
        addTask: {
            type: TaskType,
            args: {
                description: { type: GraphQLString }
            },
            resolve(parent, args) {
                let task = new Task({
                    description: args.description
                });
                return task.save();
            }
        },
        updateTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
                description: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Task.updateTask(args);
            }
        },
        addUserToTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
                userid: { type: GraphQLID }
            },
            async resolve(parent, args) {
                await Task.addUserToTask(args);
                return await Task.findTaskById(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
