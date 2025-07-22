import { db } from "../db.js";

export const getAllClients = (req, res) => {
  let { pageNo, pageSize, searchKeyword, fromDate, toDate, userID } = req.body;

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

export const AddUpdateClient = (req, res) => {
  const {
    clientKeyID,
    clientName,
    clientEmail,
    clientMobileNo,
    clientCompany,
    userID,
  } = req.body;

  // ✅ CASE 1: Add new client (if clientKeyID is not sent or null)
  if (!clientKeyID) {
    const insertQuery = `
      INSERT INTO clients (clientName, clientEmail, clientMobileNo, clientCompany, userID)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [clientName, clientEmail, clientMobileNo, clientCompany, userID],
      (err, result) => {
        if (err) return res.status(500).json(err);

        // Assuming your clients table has an auto-incremented column called `clientID`
        const fetchUUIDQuery = `SELECT clientKeyID FROM clients WHERE clientID = ?`;

        db.query(fetchUUIDQuery, [result.insertId], (err, data) => {
          if (err) return res.status(500).json(err);

          return res.status(201).json({
            message: "Client created successfully",
            clientKeyID: data[0].clientKeyID,
          });
        });
      }
    );
  }

  // ✅ CASE 2: Update existing client using clientKeyID
  else {
    const updateQuery = `
      UPDATE clients
      SET clientName = ?, clientEmail = ?, clientMobileNo = ?, clientCompany = ?
      WHERE clientKeyID = ?
    `;

    db.query(
      updateQuery,
      [clientName, clientEmail, clientMobileNo, clientCompany, clientKeyID],
      (err, result) => {
        if (err) return res.status(500).json(err);

        // Check if update actually happened
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Client not found for update" });
        }

        return res.status(200).json({
          message: "Client updated successfully",
          clientKeyID: clientKeyID,
        });
      }
    );
  }
};

// export const AddUpdateClient = (req, res) => {
//   const {
//     clientKeyID,
//     clientName,
//     clientEmail,
//     clientMobileNo,
//     clientCompany,
//     userID
//   } = req.body;

//   // ✅ Common check: clientName must not be empty
//   if (!clientName || clientName.trim() === "") {
//     return res.status(400).json({ message: "Client name is required." });
//   }

//   // ✅ CASE 1: Add new client
//   if (!clientKeyID) {
//     // 🔍 Check if a client with same name already exists
//     const checkDuplicateQuery = `SELECT clientID FROM clients WHERE clientName = ?`;

//     db.query(checkDuplicateQuery, [clientName], (dupErr, dupResult) => {
//       if (dupErr) return res.status(500).json(dupErr);

//       if (dupResult.length > 0) {
//         return res
//           .status(409)
//           .json({ message: "The client with same name already exists." });
//       }

//       // ✅ Safe to insert
//       const insertQuery = `
//         INSERT INTO clients (clientName, clientEmail, clientMobileNo, clientCompany, userID)
//         VALUES (?, ?, ?, ?, ?)
//       `;

//       db.query(
//         insertQuery,
//         [clientName, clientEmail, clientMobileNo, clientCompany, userID],
//         (err, result) => {
//           if (err) return res.status(500).json(err);

//           const fetchUUIDQuery = `SELECT clientKeyID FROM clients WHERE clientID = ?`;
//           db.query(fetchUUIDQuery, [result.insertId], (err, data) => {
//             if (err) return res.status(500).json(err);

//             return res.status(201).json({
//               message: "Client created successfully",
//               clientKeyID: data[0].clientKeyID,
//             });
//           });
//         }
//       );
//     });
//   }

//   // ✅ CASE 2: Update existing client
//   else {
//     // 🔍 Check if another client (not this one) has the same name
//     const checkDuplicateQuery = `
//       SELECT clientID FROM clients
//       WHERE clientName = ? AND clientKeyID != ?
//     `;

//     db.query(
//       checkDuplicateQuery,
//       [clientName, clientKeyID],
//       (dupErr, dupResult) => {
//         if (dupErr) return res.status(500).json(dupErr);

//         if (dupResult.length > 0) {
//           return res
//             .status(409)
//             .json({ message: "The client with same name already exists." });
//         }

//         // ✅ Safe to update
//         const updateQuery = `
//         UPDATE clients
//         SET clientName = ?, clientEmail = ?, clientMobileNo = ?, clientCompany = ?, userID = ?
//         WHERE clientKeyID = ?
//       `;

//         db.query(
//           updateQuery,
//           [clientName, clientEmail, clientMobileNo, clientCompany, clientKeyID, userID],
//           (err, result) => {
//             if (err) return res.status(500).json(err);

//             if (result.affectedRows === 0) {
//               return res
//                 .status(404)
//                 .json({ message: "Client not found for update" });
//             }

//             return res.status(200).json({
//               message: "Client updated successfully",
//               clientKeyID: clientKeyID,
//             });
//           }
//         );
//       }
//     );
//   }
// };

export const getSingleClientByID = (req, res) => {
  const { clientKeyID } = req.query;
  if (clientKeyID === null || clientKeyID === undefined || clientKeyID === "") {
    return res.status(500).json("clientKeyID is missing");
  }

  const q = `SELECT * FROM clients WHERE clientKeyID=?`;
  db.query(q, [clientKeyID], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0)
      return res
        .status(404)
        .json("No client present against mentioned clientKeyID");

    res.status(200).json(data);
  });
};

export const getClientLookupList = (req, res) => {
  const { userID } = req.query;

  // ✅ Validate userID
  if (!userID || userID.trim() === "") {
    return res.status(400).json({ error: "userID is required." });
  }

  // ✅ Step 1: Check if user exists
  const checkUserQuery = `SELECT 1 FROM users WHERE userID = ? LIMIT 1`;
  db.query(checkUserQuery, [userID], (userErr, userResult) => {
    if (userErr) return res.status(500).json(userErr);

    if (userResult.length === 0) {
      return res
        .status(404)
        .json({ error: "User with given userID not found." });
    }

    // ✅ Step 2: Fetch clients for that user
    const lookupQuery = `
      SELECT clientID AS value, clientName AS label 
      FROM clients 
      WHERE userID = ?
      ORDER BY clientName ASC
    `;

    db.query(lookupQuery, [userID], (err, results) => {
      if (err) return res.status(500).json(err);

      res.status(200).json({
        success: true,
        data: results,
      });
    });
  });
};

export const deleteClientByID = (req, res) => {
  const { clientKeyID } = req.query;

  if (!clientKeyID) {
    return res.status(400).json("clientKeyID is missing");
  }

  const q = "DELETE FROM clients WHERE clientKeyID = ?";
  db.query(q, [clientKeyID], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json("No client found with the provided clientKeyID");
    }

    res.status(200).json("Client deleted successfully");
  });
};

// ALTER TABLE client
// MODIFY COLUMN clientKeyID VARCHAR(36) NOT NULL DEFAULT (UUID());

// This is the db command I have used in the database to convert a id into keyid
