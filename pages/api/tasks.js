import db from '../../database';

export default (req, res) => {
  if (req.method === 'POST') {
    const { task, priority, dueDate } = req.body;
    db.run("INSERT INTO tasks (task, priority, dueDate) VALUES (?, ?, ?)", [task, priority, dueDate], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, task, priority, dueDate });
    });
  } else if (req.method === 'GET') {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ tasks: rows });
    });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
