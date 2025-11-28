// CREATE TABLE tasks (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   description TEXT,
//   status ENUM('todo', 'in_progress', 'done', 'blocked') DEFAULT 'todo',
//   priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
//   due_date DATE,
//   assignee_id INT,
//   created_by INT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   FOREIGN KEY (assignee_id) REFERENCES users(id),
//   FOREIGN KEY (created_by) REFERENCES users(id)
// );