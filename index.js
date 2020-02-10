const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
	console.count('Número de requisições');

	return next();
});

function checkProjectExistsInArray(req, res, next) {
	const { id } = req.params;

	const project = projects.find(p => p.id === id);

	if(!project) {
		return res.status(400).json({ error: 'Project does not exists' });
	}

	return next();
}

server.post('/projects', (req, res) => {
	const { id, title } = req.body;

	const project = {
		id,
		title,
		tasks: []
	};

	projects.push(project);

	return res.json(project);
});

server.get('/projects', (req, res) => {
	return res.json(projects);
});

server.put('/projects/:id', checkProjectExistsInArray, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	const project = projects.find(p => p.id === id);

	project.title = title;

	return res.json(project);
});

server.delete('/projects/:id', checkProjectExistsInArray, (req, res) => {
	const { id } = req.params;

	const project = projects.findIndex(p => p.id === id);
	
	projects.splice(project, 1);

	return res.json({ message: 'Deletado com sucesso' });
});

server.post('/projects/:id/tasks', checkProjectExistsInArray, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	const project = projects.find(p => p.id === id);

	project.tasks.push(title);

	return res.json(project);
});

server.listen(3000);