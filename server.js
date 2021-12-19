const express = require('express');
const path = require('path');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"))
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.post('/api/notes', (req, res) => {
  const notes = JSON.parse((fs.readFileSync('./db/db.json', 'utf8')));
  const newNote = req.body;
  newNote.id = uuidv4();
  notes.push(newNote);

  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
  res.json(notes)
  console.log(`Note saved\n ${JSON.stringify(newNote, null, 2)}`)
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse((fs.readFileSync('./db/db.json', 'utf8')));
  const noteId = req.params.id;
  const newNotes = notes.splice(notes.findIndex(e => e.id === noteId), 1)
  console.log(JSON.stringify(newNotes, null, 2))
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
  res.json(notes);
});

app.listen(PORT, () =>
  console.log(`App @ http://localhost:${PORT} 🚀🌑`)
);