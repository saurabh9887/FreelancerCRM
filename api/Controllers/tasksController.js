import { db } from "../db.js";

export const getAllTasks = (req, res) => {
  let { pageNo, pageSize, searchKeyword, fromDate, toDate, userID, clientID } =
    req.body;

  // ✅ Convert to numbers
  pageNo = Number(pageNo);
  pageSize = Number(pageSize);

  // ✅ Validate pagination values
  if (!Number.isInteger(pageNo) || pageNo < 1) {
    return res
      .status(400)
      .json({ error: "pageNo must be a positive integer." });
  }

  if (!Number.isInteger(pageSize) || pageSize < 1) {
    return res
      .status(400)
      .json({ error: "pageSize must be a positive integer." });
  }

  const offset = (pageNo - 1) * pageSize;
  const limit = pageSize;

  let baseQuery = `SELECT * FROM tasks WHERE 1=1`;
  let countQuery = `SELECT COUNT(*) AS total FROM tasks WHERE 1=1`;
  const queryParams = [];
  const countParams = [];

  if (!userID || userID.trim() === "") {
    return res.status(400).json("User does not exists");
  }

  // ✅ Filter by userID (foreign key)

  if (userID && userID.trim() !== "") {
    baseQuery += ` AND userID = ?`;
    countQuery += ` AND userID = ?`;
    queryParams.push(userID);
    countParams.push(userID);
  }

  if (clientID && clientID.trim() !== "") {
    baseQuery += ` AND clientID = ?`;
    countQuery += ` AND clientID = ?`;
    queryParams.push(clientID);
    countParams.push(clientID);
  }

  // ✅ Apply search filter (clientName or clientEmail)
  if (searchKeyword && searchKeyword.trim() !== "") {
    baseQuery += ` AND (taskTitle LIKE ?)`;
    countQuery += ` AND (taskTitle LIKE ?)`;
    const keywordPattern = `%${searchKeyword}%`;
    queryParams.push(keywordPattern, keywordPattern);
    countParams.push(keywordPattern, keywordPattern);
  }

  // ✅ Apply date range filter (if both provided)
  if (fromDate && toDate) {
    baseQuery += ` AND DATE(created_at) BETWEEN ? AND ?`;
    countQuery += ` AND DATE(created_at) BETWEEN ? AND ?`;
    queryParams.push(fromDate, toDate);
    countParams.push(fromDate, toDate);
  }

  // ✅ Add sorting & pagination
  baseQuery += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  // ✅ Execute data query
  db.query(baseQuery, queryParams, (err, data) => {
    if (err) return res.status(500).json(err);

    // ✅ Execute count query
    db.query(countQuery, countParams, (countErr, countResult) => {
      if (countErr) return res.status(500).json(countErr);

      const total = countResult[0]?.total || 0;

      res.status(200).json({
        success: true,
        data,
        total,
        pageNo,
        pageSize,
      });
    });
  });
};

export const AddUpdateTask = (req, res) => {
  const { taskKeyID, title, description, status, dueDate, userID, clientID } =
    req.body;

  // ✅ CASE 1: Add new client (if clientKeyID is not sent or null)
  if (!taskKeyID) {
    const insertQuery = `
      INSERT INTO tasks (title, description, status, dueDate,userID, clientID)
      VALUES (?, ?, ?, ?,?,?)
    `;

    db.query(
      insertQuery,
      [title, description, status, dueDate, userID, clientID],
      (err, result) => {
        if (err) return res.status(500).json(err);

        // Assuming your clients table has an auto-incremented column called `clientID`
        const fetchUUIDQuery = `SELECT taskKeyID FROM tasks WHERE taskID = ?`;

        db.query(fetchUUIDQuery, [result.insertId], (err, data) => {
          if (err) return res.status(500).json(err);

          return res.status(201).json({
            message: "Task added successfully",
            taskKeyID: data[0].taskKeyID,
          });
        });
      }
    );
  }

  // ✅ CASE 2: Update existing client using clientKeyID
  else {
    const updateQuery = `
      UPDATE tasks
      SET title = ?, description = ?, status = ?, dueDate = ?
      WHERE taskKeyID = ?
    `;

    db.query(
      updateQuery,
      [title, description, status, dueDate, taskKeyID],
      (err, result) => {
        if (err) return res.status(500).json(err);

        // Check if update actually happened
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Task not found for update" });
        }

        return res.status(200).json({
          message: "Task updated successfully",
          taskKeyID: taskKeyID,
        });
      }
    );
  }
};
