const instance = require('./instance');

const getProject = (name) => {
    return instance.get(`/projects/${name}`);
};

module.exports = { getProject };
