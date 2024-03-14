import instance from './instance.js';

export const getProject = (name: string) => {
    return instance.get(`/projects/${name}`);
};
