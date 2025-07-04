import { db } from "../db.js";

export const getAllClients = (req, res) => {
  let { pageNo, pageSize, searchKeyword, fromDate, toDate } = req.body;

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

  let baseQuery = `SELECT * FROM clients WHERE 1=1`;
  let countQuery = `SELECT COUNT(*) AS total FROM clients WHERE 1=1`;
  const queryParams = [];
  const countParams = [];

  // ✅ Apply search filter (clientName or clientEmail)
  if (searchKeyword && searchKeyword.trim() !== "") {
    baseQuery += ` AND (clientName LIKE ? OR clientEmail LIKE ?)`;
    countQuery += ` AND (clientName LIKE ? OR clientEmail LIKE ?)`;
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
