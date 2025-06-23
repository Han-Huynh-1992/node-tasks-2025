const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

module.exports = function (app) {
    // Get all tasks
    app.get('/api/tasks', async (req, res) => {
        try {
            const tasks = await Task.findAll({
                include: [
                    { model: User, attributes: ['id', 'name'], required: true },
                    { model: Project, attributes: ['id', 'name'], required: true }
                ]
            });
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Get all projects
    app.get('/api/projects', async (req, res) => {
        try {
            const projects = await Project.findAll({
                include: [
                    { model: User, attributes: ['id', 'name'], required: false },
                ]
            });
            res.json(projects);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Add new project
    app.post('/api/project', async (req, res) => {
        const maxIdResult = await Project.max('id');
        const newId = (maxIdResult || 0) + 1;

        try {
            const newProject = await Project.create({
                id: newId,
                name: req.body.name,
                description: req.body.description,
                created_date: new Date()
            });
            res.status(201).json(newProject);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // Update project
    app.put('/api/project/:id', async (req, res) => {
        try {
            const project = await Project.findByPk(req.params.id);
            if (!project) return res.status(404).json({ message: 'Project not found' });

            await project.update({
                name: req.body.name ?? project.name,
                description: req.body.description ?? project.description,
                owner_id: req.body.owner_id ?? project.owner_id
            });

            res.json(project);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Delete project
    app.delete('/api/project/:id', async (req, res) => {
        const projectId = req.params.id;

        try {
            // Delete all tasks related to project
            await Task.destroy({
                where: { project_id: projectId }
            });

            // Then, delete project
            const deletedCount = await Project.destroy({
                where: { id: projectId }
            });

            if (deletedCount === 0) {
                return res.status(404).json({ message: 'Project not found' });
            }

            res.json({ message: 'Project and related tasks deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // Get all users
    app.get('/api/users', async (req, res) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Add new task
    app.post('/api/task', async (req, res) => {
        const maxIdResult = await Task.max('id');
        const newId = (maxIdResult || 0) + 1;

        try {
            const newTask = await Task.create({
                id: newId,
                title: req.body.title,
                description: req.body.description || '',
                status: req.body.status || 'To Do',
                priority: req.body.priority || 'Low',
                due_date: req.body.due_date,
                assignee_id: req.body.assignee_id,
                project_id: req.body.project_id
            });

            // If project_id and assignee_id exist, update project owner
            if (req.body.project_id && req.body.assignee_id) {
                const project = await Project.findByPk(req.body.project_id);
                if (project) {
                    project.owner_id = req.body.assignee_id;
                    await project.save();
                }
            }
            res.status(201).json(newTask);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

};
