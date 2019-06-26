const express = require("express");

const server = express();
server.use(express.json());

let chamadas = 0;
const projects = [];

function checkProjectExists(req, res, next) {
  const id = req.params.id;
  let project;

  for (i = 0; i < projects.length; i++) {
    if (projects[i].id == id) project = projects[i];
  }

  if (!project) {
    return res.status(400).json({ erro: "Project does not exists" });
  }

  return next();
}

function qtdChamadas(req, res, next) {
  chamadas++;

  console.log(`chamadas: ${chamadas}`);

  next();
}

server.post("/projects", qtdChamadas, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.get("/projects", qtdChamadas, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", qtdChamadas, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  let project = {};

  for (index = 0; index < projects.length; index++) {
    if (projects[index].id == id) project = projects[index];
  }

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", qtdChamadas, checkProjectExists, (req, res) => {
  const { id } = req.params;

  for (index = 0; index < projects.length; index++) {
    if (projects[index].id == id) projects.splice(index, 1);
  }

  return res.send();
});

server.post(
  "/projects/:id/tasks",
  qtdChamadas,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;
    let project = {};
    const task = req.body.title;

    for (index = 0; index < projects.length; index++) {
      if (projects[index].id == id) project = projects[index];
    }

    project.tasks.push(task);

    return res.send();
  }
);

server.listen(3000);
