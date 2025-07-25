import { db } from "../db.js";

export const getAllTasks = (req, res) => {
  let { pageNo, pageSize, searchKeyword, fromDate, toDate, userID } = req.body;

  // Convert to numbers
  pageNo = Number(pageNo);
  pageSize = Number(pageSize);

  // Validate pagination
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

  const cleanUserID = userID?.trim();
  if (!cleanUserID) {
    return res.status(400).json({ error: "User does not exist." });
  }

  let baseQuery = `SELECT * FROM tasks WHERE 1=1`;
  let countQuery = `SELECT COUNT(*) AS total FROM tasks WHERE 1=1`;
  const queryParams = [];
  const countParams = [];

  // Filter by userID
  baseQuery += ` AND userID = ?`;
  countQuery += ` AND userID = ?`;
  queryParams.push(cleanUserID);
  countParams.push(cleanUserID);

  // Apply search filter
  const trimmedKeyword = searchKeyword?.trim();
  if (trimmedKeyword) {
    baseQuery += ` AND (title LIKE ?)`;
    countQuery += ` AND (title LIKE ?)`;
    const keywordPattern = `%${trimmedKeyword}%`;
    queryParams.push(keywordPattern);
    countParams.push(keywordPattern);
  }

  // ✅ Apply search filter (clientName or clientEmail)
  // if (searchKeyword && searchKeyword.trim() !== "") {
  //   baseQuery += ` AND (clientName LIKE ? OR clientEmail LIKE ?)`;
  //   countQuery += ` AND (clientName LIKE ? OR clientEmail LIKE ?)`;
  //   const keywordPattern = `%${searchKeyword}%`;
  //   queryParams.push(keywordPattern, keywordPattern);
  //   countParams.push(keywordPattern, keywordPattern);
  // }

  // Date range filter
  if (fromDate && toDate) {
    baseQuery += ` AND DATE(created_at) BETWEEN ? AND ?`;
    countQuery += ` AND DATE(created_at) BETWEEN ? AND ?`;
    queryParams.push(fromDate, toDate);
    countParams.push(fromDate, toDate);
  }

  // Sorting and pagination
  baseQuery += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  // Execute main query
  db.query(baseQuery, queryParams, (err, data) => {
    if (err) return res.status(500).json(err);

    // Execute count query
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

export const getSingleTaskByID = (req, res) => {
  const { taskKeyID } = req.query;
  if (taskKeyID === null || taskKeyID === undefined || taskKeyID === "") {
    return res.status(500).json("taskKeyID is missing");
  }

  const q = `SELECT * FROM tasks WHERE taskKeyID=?`;
  db.query(q, [taskKeyID], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0)
      return res
        .status(404)
        .json("No task present against mentioned taskKeyID");

    res.status(200).json(data);
  });
};
