// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const https = require("https");
// const path = require("path");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Serve your test folder as static files
// app.use(express.static("test"));

// // Serve main project folder
// app.use(express.static(path.join(__dirname, "/..")));

// // ================= TELEGRAM CONFIG =================
// const TELEGRAM_TOKEN  = "8514558865:AAETOehvo3vUQ-0dErDoA4mWR0cEQiTXClY"; 
// // const TELEGRAM_CHAT_ID = "1761330046"; 
// const TELEGRAM_CHAT_IDS = [
//     "1761330046",        // Owner
//     "-1003727068882"     // InvoiceSend Group
// ];

// // ================= DATABASE CONNECTION =================
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Ly$HOUR@3790", 
//     database: "pos_db"
// });

// db.connect(err => {
//     if (err) {
//         console.log("Database connection failed:", err);
//     } else {
//         console.log("Connected to MySQL");
//     }
// });

// // ================= GET PRODUCTS =================
// app.get("/api/products", (req, res) => {
//     db.query("SELECT * FROM Products ORDER BY category, name", 
//     (err, result) => {
//         if (err) {
//             res.status(500).json(err);
//         } else {
//             res.json(result);
//         }
//     });
// });

// // ================= SEND TELEGRAM =================
// app.post("/api/send-telegram", (req, res) => {

//     const { order } = req.body;

//     if (!order) {
//         return res.status(400).json({ error: "No order data" });
//     }

//     // ── Build the message text
//     const now = new Date(order.time); 
//     const day = String(now.getDate()).padStart(2, "0");
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const year = now.getFullYear();
//     const hh = String(now.getHours()).padStart(2, "0");
//     const mm = String(now.getMinutes()).padStart(2, "0");
//     const ss = String(now.getSeconds()).padStart(2, "0");

//     const totalKH = Math.round(parseFloat(order.totalUSD) * 4000);

//     let itemLines = "";

//     order.items.forEach((item, i) => {

//         const disc = parseFloat(item.discount) > 0
//             ? ` (-${item.discount}%)`
//             : "";

//         itemLines +=
//             `${i + 1}. ${item.name} ${item.size} x${item.qty}  $${parseFloat(item.total).toFixed(2)}${disc}\n`;
//     });
 
//     // Payment line
//     let payParts = [];

//     if (parseFloat(order.paidKH) > 0)
//         payParts.push(`${parseFloat(order.paidKH).toLocaleString()} ៛`);

//     if (parseFloat(order.paidUSD) > 0)
//         payParts.push(`$${parseFloat(order.paidUSD).toFixed(2)}`);
    

//     const message = `
// ☕ COFFEE SHOP — NEW ORDER
// ━━━━━━━━━━━━━━━━━━━━
// 🪑 Table: ${order.table}
// 🆔 Invoice ID: ${order.invoiceID}
// 📅 Date: ${day}-${month}-${year}
// 🕐 Time: ${hh}:${mm}:${ss}

// 📋 Items:
// ${itemLines}
// ━━━━━━━━━━━━━━━━━━━━
// 💵 Total (USD): $${parseFloat(order.totalUSD).toFixed(2)}
// 💰 Total (KH): ${totalKH.toLocaleString()} ៛
// ━━━━━━━━━━━━━━━━━━━━
// 💳 Payment Method: ${order.paymentMethod}
// 💰 Paid: ${payParts.join(" / ")}
// `;
// // 💳 Payment: ${payParts.join(" / ")}
// // ━━━━━━━━━━━━━━━━━━━━
// // ✅ Status: PAID

//  // ── Send to Telegram API
 
//     // const body = JSON.stringify({
//     //     chat_id: TELEGRAM_CHAT_ID,
//     //     text: message
//     // });

//     // const options = {
//     //     hostname: "api.telegram.org",
//     //     path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
//     //     method: "POST",
//     //     headers: {
//     //         "Content-Type": "application/json",
//     //         "Content-Length": Buffer.byteLength(body)
//     //     }
//     // };

//     // const request = https.request(options, (response) => {
//     //     let data = "";

//     //     response.on("data", chunk => data += chunk);

//     //     response.on("end", () => {
//     //         const parsed = JSON.parse(data);

//     //         if (parsed.ok) {
//     //             console.log("✅ Telegram sent");
//     //             res.json({ success: true });
//     //         } else {
//     //             console.log(parsed);
//     //             res.status(500).json({ error: parsed });
//     //         }
//     //     });
//     // });

//     // request.on("error", err => {
//     //     console.log(err);
//     //     res.status(500).json({ error: err.message });
//     // });

//     // request.write(body);
//     // request.end();
//     // ── Send to Telegram API (Owner + Group)

// const sendTelegram = (chatId) => {

//     return new Promise((resolve, reject) => {

//         const body = JSON.stringify({
//             chat_id: chatId,
//             text: message
//         });

//         const options = {
//             hostname: "api.telegram.org",
//             path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Content-Length": Buffer.byteLength(body)
//             }
//         };

//         const request = https.request(options, (response) => {

//             let data = "";

//             response.on("data", chunk => data += chunk);

//             response.on("end", () => {

//                 const parsed = JSON.parse(data);

//                 if (parsed.ok) {
//                     console.log("✅ Sent to", chatId);
//                     resolve();
//                 } else {
//                     reject(parsed);
//                 }

//             });

//         });

//         request.on("error", reject);
//         request.write(body);
//         request.end();

//     });

// };

// // send to all chats
// Promise.all(
//     TELEGRAM_CHAT_IDS.map(id => sendTelegram(id))
// )
// .then(() => {
//     res.json({ success: true });
// })
// .catch(err => {
//     console.log(err);
//     res.status(500).json(err);
// });
// });

// // this serverside save incoive frome sql
// app.post("/api/save-invoice", (req, res) => {

//     const order = req.body;

//     const invoiceSql = `
//         INSERT INTO invoices 
//         (invoice_number, table_name, order_type, payment_method, total_usd, paid_kh, paid_usd)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;

//     db.query(invoiceSql, [
//         order.invoiceID,
//         order.table,
//         order.orderType,
//         order.paymentMethod,
//         order.totalUSD,
//         order.paidKH,
//         order.paidUSD
//     ], (err, result) => {

//         if (err) return res.status(500).json(err);

//         const invoiceId = result.insertId;

//         const itemSql = `
//             INSERT INTO invoice_items
//             (invoice_id, product_name, size, qty, price, discount, total)
//             VALUES ?
//         `;

//         const itemValues = order.items.map(item => [
//             invoiceId,
//             item.name,
//             item.size,
//             item.qty,
//             item.price,
//             item.discount,
//             item.total
//         ]);

//         db.query(itemSql, [itemValues], (err2) => {
//             if (err2) return res.status(500).json(err2);
//             res.json({ success: true });
//         });
//     });
// });

// // ================= GET TRANSACTIONS =================
// // app.get("/api/transactions", (req, res) => {

// //     const sql = `
// //         SELECT 
// //             invoice_number AS invoiceID,
// //             table_name AS tableName,
// //             order_type AS orderType,
// //             payment_method AS paymentMethod,
// //             total_usd AS totalUSD,
// //             created_at AS time
// //         FROM invoices
// //         ORDER BY created_at DESC
// //     `;

// //     db.query(sql, (err, result) => {

// //         if (err) {
// //             console.log(err);
// //             res.status(500).json(err);
// //         } else {
// //             res.json(result);
// //         }

// //     });

// // });
// app.get("/api/transactions", (req, res) => {

//     const sql = `
//         SELECT 
//            invoice_number AS invoiceID,
//            table_name AS table,
//            payment_method AS paymentMethod,
//            total_usd AS totalUSD,
//            status,
//            created_at AS time
//         FROM invoices
//         ORDER BY created_at DESC
//     `;

//     db.query(sql, (err, result) => {
//         if (err) return res.status(500).json(err);
//         res.json(result);
//     });
// });


// // ================= DELETE INVOICE =================
// app.post("/api/delete-invoice", (req, res) => {

//     const { invoiceID } = req.body;

//     const sql = `
//         UPDATE invoices 
//         SET status = 'DELETED'
//         WHERE invoice_number = ?
//     `;

//     db.query(sql, [invoiceID], (err) => {
//         if (err) return res.status(500).json(err);
//         res.json({ success: true });
//     });
// });


// // ================= GET ITEMS =================
// app.get("/api/invoice-items/:invoiceID", (req, res) => {

//     const sql = `
//         SELECT ii.*
//         FROM invoice_items ii
//         JOIN invoices i ON ii.invoice_id = i.id
//         WHERE i.invoice_number = ?
//     `;

//     db.query(sql, [req.params.invoiceID], (err, result) => {
//         if (err) return res.status(500).json(err);
//         res.json(result);
//     });
// });

// // this line is the function start server 
// app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });


//=========================================================================================

// const express = require("express");
// const mysql   = require("mysql2");
// const cors    = require("cors");
// const https   = require("https");
// const path    = require("path");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use(express.static("test"));
// app.use(express.static(path.join(__dirname, "/..")));

// // ═══════════════════════════════════════
// //  TELEGRAM CONFIG
// // ═══════════════════════════════════════
// const TELEGRAM_TOKEN    = "8514558865:AAETOehvo3vUQ-0dErDoA4mWR0cEQiTXClY";
// const TELEGRAM_CHAT_IDS = [
//     "1761330046",
//     "-1003727068882"
// ];

// // ═══════════════════════════════════════
// //  DATABASE
// // ═══════════════════════════════════════
// const db = mysql.createConnection({
//     host:     "localhost",
//     user:     "root",
//     password: "Ly$HOUR@3790",
//     database: "pos_db"
// });

// db.connect(err => {
//     if (err) { console.log("Database connection failed:", err); }
//     else      { console.log("Connected to MySQL"); }
// });

// // ═══════════════════════════════════════
// //  GET PRODUCTS
// // ═══════════════════════════════════════
// app.get("/api/products", (req, res) => {
//     db.query("SELECT * FROM Products ORDER BY category, name", (err, result) => {
//         if (err) { res.status(500).json(err); }
//         else     { res.json(result); }
//     });
// });

// // ═══════════════════════════════════════
// //  GET TRANSACTIONS  (PAID + DELETED)
// // ═══════════════════════════════════════
// app.get("/api/transactions", (req, res) => {
//     const sql = `
//         SELECT
//             invoice_number  AS invoiceID,
//             table_name      AS \`table\`,
//             order_type      AS orderType,
//             payment_method  AS paymentMethod,
//             total_usd       AS totalUSD,
//             status,
//             created_at      AS time
//         FROM invoices
//         ORDER BY created_at DESC
//     `;
//     db.query(sql, (err, result) => {
//         if (err) { console.log(err); return res.status(500).json(err); }
//         res.json(result);
//     });
// });

// // ═══════════════════════════════════════
// //  GET FULL INVOICE DETAIL
// //  Used by New.html when opened with
// //  ?view=INVOICEID  or  ?deleted=INVOICEID
// //  Returns: invoice header + all items
// // ═══════════════════════════════════════
// app.get("/api/invoice-detail/:invoiceID", (req, res) => {
//     const invoiceID = req.params.invoiceID;

//     // 1. Get invoice header
//     const headerSql = `
//         SELECT
//             invoice_number  AS invoiceID,
//             table_name      AS tableName,
//             order_type      AS orderType,
//             payment_method  AS paymentMethod,
//             total_usd       AS totalUSD,
//             paid_kh         AS paidKH,
//             paid_usd        AS paidUSD,
//             status,
//             created_at      AS time
//         FROM invoices
//         WHERE invoice_number = ?
//         LIMIT 1
//     `;

//     db.query(headerSql, [invoiceID], (err, headers) => {
//         if (err)              { console.log(err); return res.status(500).json(err); }
//         if (!headers.length)  { return res.status(404).json({ error: "Invoice not found" }); }

//         const header = headers[0];

//         // 2. Get all items for this invoice
//         const itemsSql = `
//             SELECT
//                 ii.product_name AS name,
//                 ii.size,
//                 ii.qty,
//                 ii.price,
//                 ii.discount,
//                 ii.total,
//                 ii.cancelled
//             FROM invoice_items ii
//             JOIN invoices i ON ii.invoice_id = i.id
//             WHERE i.invoice_number = ?
//             ORDER BY ii.id ASC
//         `;

//         db.query(itemsSql, [invoiceID], (err2, items) => {
//             if (err2) { console.log(err2); return res.status(500).json(err2); }

//             res.json({
//                 ...header,
//                 items: items
//             });
//         });
//     });
// });

// // ═══════════════════════════════════════
// //  SAVE INVOICE
// // ═══════════════════════════════════════
// app.post("/api/save-invoice", (req, res) => {
//     const order = req.body;

//     const invoiceSql = `
//         INSERT INTO invoices
//             (invoice_number, table_name, order_type, payment_method,
//              total_usd, paid_kh, paid_usd)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;

//     db.query(invoiceSql, [
//         order.invoiceID, order.table, order.orderType,
//         order.paymentMethod, order.totalUSD, order.paidKH, order.paidUSD
//     ], (err, result) => {
//         if (err) { console.log(err); return res.status(500).json(err); }

//         const invoiceId = result.insertId;

//         const itemSql = `
//             INSERT INTO invoice_items
//                 (invoice_id, product_name, size, qty, price, discount, total, cancelled)
//             VALUES ?
//         `;

//         const itemValues = order.items.map(item => [
//             invoiceId, item.name, item.size,
//             item.qty, item.price, item.discount, item.total,
//             item.cancelled ? 1 : 0   // ← save red strikethrough flag
//         ]);

//         db.query(itemSql, [itemValues], (err2) => {
//             if (err2) { console.log(err2); return res.status(500).json(err2); }
//             res.json({ success: true });
//         });
//     });
// });

// // ═══════════════════════════════════════
// //  DELETE INVOICE  (soft delete)
// // ═══════════════════════════════════════
// app.post("/api/delete-invoice", (req, res) => {
//     const { invoiceID } = req.body;
//     const sql = `UPDATE invoices SET status = 'DELETED' WHERE invoice_number = ?`;
//     db.query(sql, [invoiceID], (err) => {
//         if (err) { console.log(err); return res.status(500).json(err); }
//         res.json({ success: true });
//     });
// });

// // ═══════════════════════════════════════
// //  GET INVOICE ITEMS  (legacy endpoint)
// // ═══════════════════════════════════════
// app.get("/api/invoice-items/:invoiceID", (req, res) => {
//     const sql = `
//         SELECT ii.*
//         FROM invoice_items ii
//         JOIN invoices i ON ii.invoice_id = i.id
//         WHERE i.invoice_number = ?
//     `;
//     db.query(sql, [req.params.invoiceID], (err, result) => {
//         if (err) { console.log(err); return res.status(500).json(err); }
//         res.json(result);
//     });
// });

// // ═══════════════════════════════════════
// //  SEND TELEGRAM
// // ═══════════════════════════════════════
// app.post("/api/send-telegram", (req, res) => {
//     const { order } = req.body;
//     if (!order) return res.status(400).json({ error: "No order data" });

//     const now   = new Date(order.time);
//     const p     = v => String(v).padStart(2, '0');
//     const totalKH = Math.round(parseFloat(order.totalUSD) * 4000);

//     let itemLines = "";
//     order.items.forEach((item, i) => {
//         const disc = parseFloat(item.discount) > 0 ? ` (-${item.discount}%)` : "";
//         itemLines += `${i+1}. ${item.name} ${item.size} x${item.qty}  $${parseFloat(item.total).toFixed(2)}${disc}\n`;
//     });

//     let payParts = [];
//     if (parseFloat(order.paidKH)  > 0) payParts.push(`${parseFloat(order.paidKH).toLocaleString()} ៛`);
//     if (parseFloat(order.paidUSD) > 0) payParts.push(`$${parseFloat(order.paidUSD).toFixed(2)}`);

//     const message =
// `☕ COFFEE SHOP — NEW ORDER
// ━━━━━━━━━━━━━━━━━━━━
// 🪑 Table: ${order.table}
// 🆔 Invoice ID: ${order.invoiceID}
// 📅 Date: ${p(now.getDate())}-${p(now.getMonth()+1)}-${now.getFullYear()}
// 🕐 Time: ${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}

// 📋 Items:
// ${itemLines}
// ━━━━━━━━━━━━━━━━━━━━
// 💵 Total (USD): $${parseFloat(order.totalUSD).toFixed(2)}
// 💰 Total (KH):  ${totalKH.toLocaleString()} ៛
// ━━━━━━━━━━━━━━━━━━━━
// 💳 Payment Method: ${order.paymentMethod}
// 💰 Paid: ${payParts.join(" / ")}`;

//     const sendToOne = (chatId) => new Promise((resolve, reject) => {
//         const body = JSON.stringify({ chat_id: chatId, text: message });
//         const options = {
//             hostname: "api.telegram.org",
//             path:     `/bot${TELEGRAM_TOKEN}/sendMessage`,
//             method:   "POST",
//             headers:  { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
//         };
//         const req2 = https.request(options, (r) => {
//             let data = "";
//             r.on("data", chunk => data += chunk);
//             r.on("end", () => {
//                 const parsed = JSON.parse(data);
//                 if (parsed.ok) { console.log("✅ Sent to", chatId); resolve(); }
//                 else           { reject(parsed); }
//             });
//         });
//         req2.on("error", reject);
//         req2.write(body);
//         req2.end();
//     });

//     Promise.all(TELEGRAM_CHAT_IDS.map(id => sendToOne(id)))
//         .then(() => res.json({ success: true }))
//         .catch(err => { console.log(err); res.status(500).json(err); });
// });

// // ═══════════════════════════════════════
// //  START SERVER
// // ═══════════════════════════════════════
// app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });

const express = require("express");
const mysql   = require("mysql2");
const cors    = require("cors");
const https   = require("https");
const path    = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("test"));
app.use(express.static(path.join(__dirname, "/..")));

// ═══════════════════════════════════════
//  TELEGRAM CONFIG
// ═══════════════════════════════════════
// const TELEGRAM_TOKEN    = "8514558865:AAETOehvo3vUQ-0dErDoA4mWR0cEQiTXClY";
// const TELEGRAM_CHAT_IDS = [
//     "1761330046",
//     "-1003727068882",
//     "-5183263294",
// ];
const TELEGRAM_TOKEN    = "8796925029:AAFUopYfmjn8TYv5JjIhWJrAVPl7I_dooEk";
const TELEGRAM_CHAT_IDS = [
    "-5183263294",
];
// ═══════════════════════════════════════
//  DATABASE
// ═══════════════════════════════════════
const db = mysql.createConnection({
    host:     "localhost",
    user:     "root",
    password: "Phea4u**",
    database: "KhamoMenu"
});

db.connect(err => {
    if (err) { console.log("Database connection failed:", err); }
    else      { console.log("Connected to MySQL"); }
});

// ═══════════════════════════════════════
//  GET PRODUCTS
// ═══════════════════════════════════════
app.get("/api/products", (req, res) => {
    db.query("SELECT * FROM Products ORDER BY category, name", (err, result) => {
        if (err) { res.status(500).json(err); }
        else     { res.json(result); }
    });
});

// ═══════════════════════════════════════
//  GET TRANSACTIONS  (PAID + DELETED)
//  Only returns invoices where shift_closed = 0
//  (today's open shift data only)
// ═══════════════════════════════════════
app.get("/api/transactions", (req, res) => {
    const sql = `
        SELECT
            invoice_number  AS invoiceID,
            table_name      AS \`table\`,
            order_type      AS orderType,
            payment_method  AS paymentMethod,
            total_usd       AS totalUSD,
            status,
            created_at      AS time
        FROM invoices
        WHERE shift_closed = 0
        ORDER BY created_at DESC
    `;
    db.query(sql, (err, result) => {
        if (err) { console.log(err); return res.status(500).json(err); }
        res.json(result);
    });
});

// ═══════════════════════════════════════
//  CLOSE SHIFT
//  Marks ALL invoices with shift_closed = 0
//  as shift_closed = 1.
//  After this, /api/transactions returns 0
//  records → transaction record starts fresh.
// ═══════════════════════════════════════
app.post("/api/close-shift", (req, res) => {
    const sql = `
        UPDATE invoices
        SET shift_closed = 1
        WHERE shift_closed = 0
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.log("Close shift error:", err);
            return res.status(500).json({ error: err.message });
        }
        const closed = result.affectedRows;
        console.log(`✅ Shift closed — ${closed} invoices archived`);
        res.json({ success: true, closed: closed });
    });
});

// ═══════════════════════════════════════
//  GET FULL INVOICE DETAIL
//  Used by New.html ?view=ID or ?deleted=ID
// ═══════════════════════════════════════
app.get("/api/invoice-detail/:invoiceID", (req, res) => {
    const invoiceID = req.params.invoiceID;

    const headerSql = `
        SELECT
            invoice_number  AS invoiceID,
            table_name      AS tableName,
            order_type      AS orderType,
            payment_method  AS paymentMethod,
            total_usd       AS totalUSD,
            paid_kh         AS paidKH,
            paid_usd        AS paidUSD,
            status,
            created_at      AS time
        FROM invoices
        WHERE invoice_number = ?
        LIMIT 1
    `;

    db.query(headerSql, [invoiceID], (err, headers) => {
        if (err)             { console.log(err); return res.status(500).json(err); }
        if (!headers.length) { return res.status(404).json({ error: "Invoice not found" }); }

        const header = headers[0];

        const itemsSql = `
            SELECT
                ii.product_name AS name,
                ii.size,
                ii.qty,
                ii.price,
                ii.discount,
                ii.total,
                ii.cancelled
            FROM invoice_items ii
            JOIN invoices i ON ii.invoice_id = i.id
            WHERE i.invoice_number = ?
            ORDER BY ii.id ASC
        `;

        db.query(itemsSql, [invoiceID], (err2, items) => {
            if (err2) { console.log(err2); return res.status(500).json(err2); }
            res.json({ ...header, items: items });
        });
    });
});

// ═══════════════════════════════════════
//  SAVE INVOICE
// ═══════════════════════════════════════
app.post("/api/save-invoice", (req, res) => {
    const order = req.body;

    const invoiceSql = `
        INSERT INTO invoices
            (invoice_number, table_name, order_type, payment_method,
             total_usd, paid_kh, paid_usd)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(invoiceSql, [
        order.invoiceID, order.table, order.orderType,
        order.paymentMethod, order.totalUSD, order.paidKH, order.paidUSD
    ], (err, result) => {
        if (err) { console.log(err); return res.status(500).json(err); }

        const invoiceId = result.insertId;

        const itemSql = `
            INSERT INTO invoice_items
                (invoice_id, product_name, size, qty, price, discount, total, cancelled)
            VALUES ?
        `;

        const itemValues = order.items.map(item => [
            invoiceId, item.name, item.size,
            item.qty, item.price, item.discount, item.total,
            item.cancelled ? 1 : 0
        ]);

        db.query(itemSql, [itemValues], (err2) => {
            if (err2) { console.log(err2); return res.status(500).json(err2); }
            res.json({ success: true });
        });
    });
});

// ═══════════════════════════════════════
//  DELETE INVOICE  (soft delete)
// ═══════════════════════════════════════
app.post("/api/delete-invoice", (req, res) => {
    const { invoiceID } = req.body;
    const sql = `UPDATE invoices SET status = 'DELETED' WHERE invoice_number = ?`;
    db.query(sql, [invoiceID], (err) => {
        if (err) { console.log(err); return res.status(500).json(err); }
        res.json({ success: true });
    });
});

// this for export sale all data 
app.get("/api/transactions/export", (req, res) => {
    const sql = `
        SELECT
            invoice_number  AS invoiceID,
            table_name      AS \`table\`,
            order_type      AS orderType,
            payment_method  AS paymentMethod,
            total_usd       AS totalUSD,
            status,
            created_at      AS time,
            shift_closed
        FROM invoices
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

// ═══════════════════════════════════════
//  GET INVOICE ITEMS  (legacy endpoint)
// ═══════════════════════════════════════
app.get("/api/invoice-items/:invoiceID", (req, res) => {
    const sql = `
        SELECT ii.*
        FROM invoice_items ii
        JOIN invoices i ON ii.invoice_id = i.id
        WHERE i.invoice_number = ?
    `;
    db.query(sql, [req.params.invoiceID], (err, result) => {
        if (err) { console.log(err); return res.status(500).json(err); }
        res.json(result);
    });
});

// ═══════════════════════════════════════
//  SEND TELEGRAM
// ═══════════════════════════════════════
app.post("/api/send-telegram", (req, res) => {
    const { order } = req.body;
    if (!order) return res.status(400).json({ error: "No order data" });

    const now     = new Date(order.time);
    const p       = v => String(v).padStart(2, '0');
    const totalKH = Math.round(parseFloat(order.totalUSD) * 4000);

    let itemLines = "";
    order.items.forEach((item, i) => {
        const disc = parseFloat(item.discount) > 0 ? ` (-${item.discount}%)` : "";
        itemLines += `${i+1}. ${item.name} ${item.size} x${item.qty}  $${parseFloat(item.total).toFixed(2)}${disc}\n`;
    });

    let payParts = [];
    if (parseFloat(order.paidKH)  > 0) payParts.push(`${parseFloat(order.paidKH).toLocaleString()} ៛`);
    if (parseFloat(order.paidUSD) > 0) payParts.push(`$${parseFloat(order.paidUSD).toFixed(2)}`);

    const message =
`☕ Khamo Coffee — NEW ORDER
━━━━━━━━━━━━━━━━━━━━
🪑 Table: ${order.table}
🆔 Invoice ID: ${order.invoiceID}
📅 Date: ${p(now.getDate())}-${p(now.getMonth()+1)}-${now.getFullYear()}
🕐 Time: ${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}

📋 Items:
${itemLines}
━━━━━━━━━━━━━━━━━━━━
💵 Total (USD): $${parseFloat(order.totalUSD).toFixed(2)}
💰 Total (KH):  ${totalKH.toLocaleString()} ៛
━━━━━━━━━━━━━━━━━━━━
💳 Payment Method: ${order.paymentMethod}
💰 Paid: ${payParts.join(" / ")}
Address: Areyksat Phnom Penh Cambodia
WI-FI Password: 011889968
Thank you!Enjoy your coffee!


`;

    const sendToOne = (chatId) => new Promise((resolve, reject) => {
        const body = JSON.stringify({ chat_id: chatId, text: message });
        const options = {
            hostname: "api.telegram.org",
            path:     `/bot${TELEGRAM_TOKEN}/sendMessage`,
            method:   "POST",
            headers:  { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
        };
        const req2 = https.request(options, (r) => {
            let data = "";
            r.on("data", chunk => data += chunk);
            r.on("end", () => {
                const parsed = JSON.parse(data);
                if (parsed.ok) { console.log("✅ Sent to", chatId); resolve(); }
                else           { reject(parsed); }
            });
        });
        req2.on("error", reject);
        req2.write(body);
        req2.end();
    });

    Promise.all(TELEGRAM_CHAT_IDS.map(id => sendToOne(id)))
        .then(() => res.json({ success: true }))
        .catch(err => { console.log(err); res.status(500).json(err); });
});

// ═══════════════════════════════════════
//  START SERVER
// ═══════════════════════════════════════
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});