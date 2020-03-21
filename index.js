const express = require('express');
const server = express();
server.use(express.json());

const projects = [
  {
    id: 1,
    title: 'Tarefas de casa',
    task: ['Limpar guarda roupa', 'Lavar as roupas']
  },
  {
    id: 2,
    title: 'Tarefas do trabalho',
    task: ['Reunião', 'Entrega de relatórios']
  },
  {
    id: 3,
    title: 'Manuntenção PC',
    task: ['Limpar ventoinha', 'Formatar disco']
  }
];

function totalReq(req, res, next) {
  console.count('Number of Request');
  next();
}

function checkProjectInArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find(proj => proj.id == id);
  
  if (!project) {
    return res.status(400).json({ error: 'Project not found' })  
  }

  req.project = project;
  return next();
}

server.get('/projects', totalReq, (req, res) => {
  return res.json(projects);
})

server.get('/projects/:id', totalReq, checkProjectInArray, (req, res) => {
  return res.json(req.project);
})

server.put('/projects/:id', totalReq, checkProjectInArray, (req, res) => {
  const { title } = req.body;
  req.project.title = title;
  return res.json(req.project);
})

server.post('/projects', totalReq, (req, res) => {
  const { id, title } = req.body;
  const project = {id, title, task: []};
  projects.push(project);
  return res.json(projects);
})

server.delete('/projects/:id', totalReq, (req, res) => {
  const { id } = req.body;
  const projectIndex = projects.findIndex(proj => proj.id == id);
  projects.splice(projectIndex, 1);
  return res.json(projects);
})

server.post('/projects/:id/task', totalReq, checkProjectInArray, (req, res) => {
  const { title } = req.body;
  req.project.task.push(title);
  return res.json(req.project);
})

server.listen(3000);