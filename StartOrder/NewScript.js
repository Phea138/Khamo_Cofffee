

let keypadMode       = null;
let selectedTable    = null;
let paymentKH        = 0;
let paymentUSD       = 0;
let currentInvoiceID = null;

let orderType = localStorage.getItem('orderType') || "Dine In";

/* ══════════════════════════════════════════════════
   ON LOAD
══════════════════════════════════════════════════ */
window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const viewID = params.get("view");
    const deletedID = params.get("deleted");

    if (viewID) { loadInvoiceFromServer(viewID, "PAID"); return; }
    if (deletedID) { loadInvoiceFromServer(deletedID, "DELETED"); return; }

    
    const savedTable = localStorage.getItem("selectedTable");
    if (savedTable) {
        selectedTable = savedTable;
        startOrderScreen();
    } else {
        openTableKeypad();
    }
}

/* ══════════════════════════════════════════════════
   LOAD INVOICE FROM SERVER  (read-only view)
══════════════════════════════════════════════════ */
async function loadInvoiceFromServer(invoiceID, mode) {
    try {
        const res   = await fetch(`http://localhost:3000/api/invoice-detail/${invoiceID}`);
        const order = await res.json();

        if (!order || order.error) { alert("Invoice not found: " + invoiceID); return; }

        document.getElementById("orderContainer").style.display = "flex";

        const label = order.tableName || order.table || "Takeaway";
        document.getElementById("showTable").innerText =
            label + (mode === "DELETED" ? "  🗑 [DELETED]" : "  ✅ [PAID]");

        const tbody = document.getElementById("table-item");
        tbody.innerHTML = "";

        (order.items || []).forEach(item => {
            const row = tbody.insertRow();
            row.insertCell(0).innerText = item.name;
            row.insertCell(1).innerText = item.size;
            row.insertCell(2).innerText = item.qty;
            row.insertCell(3).innerText = parseFloat(item.price).toFixed(2);
            row.insertCell(4).innerText = parseFloat(item.discount) + "%";
            row.insertCell(5).innerText = parseFloat(item.total).toFixed(2);
            row.insertCell(6).innerText = mode === "DELETED" ? "🗑" : "✅";

            if (item.cancelled == 1 || item.cancelled === true) row.classList.add("cancelled-row");

            if (mode === "DELETED" && !(item.cancelled == 1 || item.cancelled === true)) {
                row.style.background = "#fff5f5";
            } else if (mode === "PAID") {
                row.style.background = "#f5fff8";
            }

             //  for comment sedn to tgl 
         if (item.comment && item.comment.trim() !== "") {
             insertCommentRow(row, item.comment);
         }
        });

        const totalUSD = parseFloat(order.totalUSD || 0);
        const totalKH  = totalUSD * 4000;

        document.getElementById("subTotal").innerText      = totalUSD.toFixed(2);
        document.getElementById("discount").innerText      = "—";
        document.getElementById("totalPriceUSD").innerText = totalUSD.toFixed(2);
        document.getElementById("totalPriceKh").innerText  = totalKH.toLocaleString();

        const paidKH  = parseFloat(order.paidKH  || 0);
        const paidUSD = parseFloat(order.paidUSD || 0);
        document.getElementById("changeKH").innerText  = paidKH  > 0 ? paidKH.toLocaleString() + " ៛" : "—";
        document.getElementById("changeUSD").innerText = paidUSD > 0 ? "$ " + paidUSD.toFixed(2)       : "—";

        ["cashKHPayment","cashUSDPayment","abaQRPayment","abaCardPayment","removeTransaction"]
            .forEach(id => {
                const el = document.getElementById(id);
                if (el) { el.disabled = true; el.style.opacity = "0.4"; el.style.cursor = "not-allowed"; }
            });

    } catch (err) {
        console.error("Failed to load invoice:", err);
        alert("Could not load invoice from server.");
    }
}

/* ══════════════════════════════════════════════════
   BACK BUTTON
══════════════════════════════════════════════════ */
function goBackPage() {
    const params    = new URLSearchParams(window.location.search);
    const viewID    = params.get("view");
    const deletedID = params.get("deleted");

    if (viewID || deletedID) {
        window.location.href = "/Khamo POS/POS_SYSTEM/StransactionRecord/stransaction.html";
        return;
    }

    saveUnpaidOrder();
    // window.location.href = "../Navbar/DineIn.html";
    if (orderType === "Takeaway") {
        window.location.href = "../Navbar/TakeAway.html";
    } else {
        window.location.href = "../Navbar/DineIn.html";
    }
}

/* ══════════════════════════════════════════════════
   TABLE KEYPAD
══════════════════════════════════════════════════ */
function openTableKeypad() {
    keypadMode   = "TABLE";
    currentInput = null;
    keypad.style.display = "flex";
    display.innerText = "0";
}

function startOrderScreen() {
    document.getElementById("orderContainer").style.display = "flex";
    document.getElementById("showTable").innerText =
        orderType === "Takeaway" ? "Takeaway" : selectedTable;
    loadExistingOrder();
}

/* ══════════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════════ */
let products = [];
const itemContainer = document.querySelector(".item");

function showCategory(category) {
    itemContainer.innerHTML = "";
    products.filter(p => p.category === category).forEach(product => {
        const btn = document.createElement("button");
        btn.innerText = `${product.name} ${product.size}`;
        btn.onclick   = () => addItem(product.name, product.size, parseFloat(product.price), product.category);
        itemContainer.appendChild(btn);
    });
}

async function loadProducts() {
    try {
        const response = await fetch("http://localhost:3000/api/products");
        products = await response.json();
    } catch (error) {
        console.error("Error loading products:", error);
    }
}
loadProducts();

/* ══════════════════════════════════════════════════
   ORDER TABLE  — addItem
   comment param: optional string to restore saved comment
══════════════════════════════════════════════════ */
function addItem(name, size, unitPrice, category, comment) {
    const table = document.getElementById('table-item');
    const row   = table.insertRow();

    row.dataset.category        = category || "";
    row.insertCell(0).innerText = name;
    row.insertCell(1).innerText = size;

    const qtyCell = row.insertCell(2);
    qtyCell.innerText       = 1;
    qtyCell.contentEditable = "true";

    row.insertCell(3).innerText = unitPrice.toFixed(2);

    const discountCell = row.insertCell(4);
    discountCell.innerText       = 0;
    discountCell.contentEditable = "true";

    row.insertCell(5).innerText = unitPrice.toFixed(2);

    qtyCell.oninput = discountCell.oninput = function () {
        calculateRow(row);
        calculateTotal();
    };

    /* click to select row */
    row.onclick = function () {
        document.querySelectorAll("#table-item tr").forEach(r => r.classList.remove("selected-row"));
        row.classList.add("selected-row");
    };

    const deleteCell = row.insertCell(6);
    const btncancel  = document.createElement("img");
    btncancel.src    = "../img/delete_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png";
    btncancel.style.cursor = "pointer";
    btncancel.onclick = function (e) {
        e.stopPropagation();
        if (row.classList.contains("cancelled-row")) return;
        row.classList.add("cancelled-row");
        /* also dim comment row if exists */
        const next = row.nextElementSibling;
        if (next && next.classList.contains("comment-row")) {
            next.style.opacity = "0.4";
        }
        calculateTotal();
    };
    deleteCell.appendChild(btncancel);

    /* ── Restore saved comment immediately after inserting the item row ── */
    if (comment && comment.trim() !== "") {
        insertCommentRow(row, comment);
    }

    calculateTotal();
}

/* ══════════════════════════════════════════════════
   INSERT COMMENT ROW  (shared helper)
══════════════════════════════════════════════════ */
function insertCommentRow(itemRow, text) {
    /* remove old comment row for this item if it exists */
    const existing = itemRow.nextElementSibling;
    if (existing && existing.classList.contains("comment-row")) {
        existing.remove();
    }

    const newRow  = document.createElement("tr");
    newRow.classList.add("comment-row");

    const cell       = document.createElement("td");
    cell.colSpan     = 7;
    cell.innerHTML   = `<div class="comment-text"
        style="padding:4px 10px;font-size:12px;color:#555;font-style:italic;">
        💬 ${text}
    </div>`;
    newRow.appendChild(cell);

    /* insert right after the item row */
    itemRow.parentNode.insertBefore(newRow, itemRow.nextSibling);
}

/* ══════════════════════════════════════════════════
   COMMENT  — receive from keyboard iframe
══════════════════════════════════════════════════ */
window.addEventListener("message", function (event) {

    if (event.data.type === "CLOSE_COMMENT") {
        closeCommentModal();
        return;
    }

    if (event.data.type === "COMMENT") {
        const selected = document.querySelector(".selected-row");
        if (!selected) { closeCommentModal(); return; }

        const text = (event.data.text || "").trim();
        if (text !== "") {
            insertCommentRow(selected, text);
        }
        closeCommentModal();
    }
});

function closeCommentModal() {
    const m = document.getElementById("commentModal");
    if (m) { m.style.display = "none"; m.classList.remove("active"); }
}

/* ══════════════════════════════════════════════════
   CALCULATE ROW  — skip comment rows
══════════════════════════════════════════════════ */
function calculateRow(row) {
    if (row.classList.contains("comment-row")) return;
    const price    = parseFloat(row.cells[3].innerText) || 0;
    const qty      = parseFloat(row.cells[2].innerText) || 1;
    const discount = parseFloat(row.cells[4].innerText) || 0;
    let total      = price * qty;
    total         -= total * discount / 100;
    row.cells[5].innerText = total.toFixed(2);
}

/* ══════════════════════════════════════════════════
   CALCULATE TOTAL  — skip comment rows & cancelled
══════════════════════════════════════════════════ */
function calculateTotal() {
    let subTotal = 0, totalDiscount = 0;

    document.querySelectorAll("#table-item tr").forEach(row => {
        if (row.classList.contains("comment-row"))   return;
        if (row.classList.contains("cancelled-row")) return;
        if (!row.cells || row.cells.length < 6)      return;

        const price    = parseFloat(row.cells[3].innerText) || 0;
        const qty      = parseFloat(row.cells[2].innerText) || 1;
        const discount = parseFloat(row.cells[4].innerText) || 0;
        const rowTotal = price * qty;
        subTotal      += rowTotal;
        totalDiscount += rowTotal * discount / 100;
    });

    const totalUSD = subTotal - totalDiscount;
    const totalKH  = totalUSD * 4000;

    document.getElementById("subTotal").innerText      = subTotal.toFixed(2);
    document.getElementById("discount").innerText      = totalDiscount.toFixed(2);
    document.getElementById("totalPriceUSD").innerText = totalUSD.toFixed(2);
    document.getElementById("totalPriceKh").innerText  = totalKH.toLocaleString();

    const paidUSD = paymentUSD + (paymentKH / 4000);
    let changeUSD = 0, changeKH = 0;
    if (paidUSD >= totalUSD && totalUSD > 0) {
        changeUSD = paidUSD - totalUSD;
        changeKH  = changeUSD * 4000;
    }
    document.getElementById("changeUSD").innerText = changeUSD.toFixed(2);
    document.getElementById("changeKH").innerText  = changeKH.toLocaleString();
}

document.getElementById('cashKHPayment').addEventListener('input', calculateTotal);
document.getElementById('cashUSDPayment').addEventListener('input', calculateTotal);

/* ══════════════════════════════════════════════════
   SAVE UNPAID ORDER
    reads comment row AFTER each item row and saves
     it inside item.comment so it survives back/edit
══════════════════════════════════════════════════ */
function saveUnpaidOrder() {
    const allRows = document.querySelectorAll("#table-item tr");
    
    if (allRows.length === 0) return;

    const items = [];

    allRows.forEach(row => {
        /* skip comment rows — they are handled inside their item */
        if (row.classList.contains("comment-row")) return;
        if (!row.cells || row.cells.length < 6)   return;

        const c = row.cells;

        /* look for a comment row immediately after this item row */
        let commentText = "";
        const nextRow = row.nextElementSibling;
        if (nextRow && nextRow.classList.contains("comment-row")) {
            const div = nextRow.querySelector(".comment-text");
            if (div) {
                /* strip the "comment" prefix before saving */
                commentText = div.innerText.replace(/^💬\s*/, "").trim();
            }
        }

        items.push({
            name:      c[0].innerText,
            size:      c[1].innerText,
            qty:       c[2].innerText,
            price:     c[3].innerText,
            discount:  c[4].innerText,
            total:     c[5].innerText,
            cancelled: row.classList.contains("cancelled-row"),
            comment:   commentText          //  saved comment with item
        });
    });

    let dineInOrders  = JSON.parse(localStorage.getItem("dineInOrders")) || [];

    // let existingOrder = dineInOrders.find(o => o.table === selectedTable);
    const tableName = selectedTable || "No Table";
    let existingOrder = dineInOrders.find(o => o.table === tableName);

    const totalUSD    = parseFloat(document.getElementById("totalPriceUSD").innerText) || 0;

    if (existingOrder) {
        existingOrder.items  = items;
        existingOrder.total  = totalUSD.toFixed(2);
        existingOrder.time   = new Date().toLocaleTimeString();
        existingOrder.orderType  = orderType; 
        existingOrder.status = "UNPAID";
    } else {
        dineInOrders.push({
            id:     Date.now(),
            // table:  selectedTable,
            table: tableName,
            orderType: orderType, // ordertype for dinein or takeaway
            status: "UNPAID",
            total:  totalUSD.toFixed(2),
            time:   new Date().toLocaleTimeString(),
            items
        });
    }

    localStorage.setItem("dineInOrders", JSON.stringify(dineInOrders));
    document.getElementById("table-item").innerHTML = "";
    paymentKH = 0; paymentUSD = 0;
    calculateTotal();
}

/* ══════════════════════════════════════════════════
   LOAD EXISTING ORDER
   — passes saved comment back to addItem so the
     comment row is re-created automatically
══════════════════════════════════════════════════ */
function loadExistingOrder() {

    const orders   = JSON.parse(localStorage.getItem("dineInOrders")) || [];
    
    const existing = orders.find(o => o.table === selectedTable);

    if (!existing) return;

    existing.items.forEach(i => {
        /* pass i.comment as 5th arg — addItem will insert the comment row */
        addItem(i.name, i.size, parseFloat(i.price), i.category || "", i.comment || "");

        /* find the last non-comment item row to apply saved qty / discount */
        const rows    = document.querySelectorAll("#table-item tr:not(.comment-row)");
        const lastRow = rows[rows.length - 1];

        lastRow.cells[2].innerText = i.qty;
        lastRow.cells[4].innerText = i.discount;

        if (i.cancelled) {
            lastRow.classList.add("cancelled-row");
            /* dim the comment row too if item is cancelled */
            const next = lastRow.nextElementSibling;
            if (next && next.classList.contains("comment-row")) {
                next.style.opacity = "0.4";
            }
        }

        calculateRow(lastRow);
    });

    calculateTotal();
}

/* ══════════════════════════════════════════════════
   RECEIPT + TELEGRAM
══════════════════════════════════════════════════ */
function printReceipt(orderData) {
    if (!orderData) { alert("No order data to print."); return; }
    localStorage.setItem("receiptData", JSON.stringify(orderData));
    window.location.href = "../Navbar/DineIn.html"; // bong want connect display reciept swap it ../Invoice/invoice.html
}

async function sendTelegram(orderData) {
    try {
        const response = await fetch("http://localhost:3000/api/send-telegram", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ order: orderData })
        });
        const result = await response.json();
        if (result.success) { console.log("✅ Telegram sent"); }
        else                { console.error("❌ Telegram failed:", result); }
    } catch (err) { console.error("❌ Telegram error:", err); }
}

/* ══════════════════════════════════════════════════
   BUILD ORDER DATA  — skip comment rows
   also reads comment from next sibling if present
══════════════════════════════════════════════════ */
function buildOrderData(paymentMethod) {
    const items    = [];
    const isABA    = paymentMethod === "ABA QR" || paymentMethod === "ABA Card";
    const totalUSD = parseFloat(document.getElementById("totalPriceUSD").innerText) || 0;

    document.querySelectorAll("#table-item tr").forEach(row => {
        if (row.classList.contains("comment-row")) return;
        if (!row.cells || row.cells.length < 6)   return;

        const c         = row.cells;
        const cancelled = row.classList.contains("cancelled-row");

        /* grab comment text from the next sibling if it's a comment row */
        let commentText = "";
        const nextRow = row.nextElementSibling;
        if (nextRow && nextRow.classList.contains("comment-row")) {
            const div = nextRow.querySelector(".comment-text");
            if (div) commentText = div.innerText.replace(/^💬\s*/, "").trim();
        }

        items.push({
            name:      c[0].innerText,
            size:      c[1].innerText,
            qty:       c[2].innerText,
            price:     c[3].innerText,
            discount:  c[4].innerText,
            total:     c[5].innerText,
            category:  row.dataset.category || "",
            cancelled: cancelled,
            comment:   commentText
        });
    });

    return {
        invoiceID:     generateInvoiceNumber(),
        table:         selectedTable || "Takeaway",
        orderType:     orderType,
        paymentMethod: paymentMethod,
        time:          new Date().toISOString(),
        totalUSD:      totalUSD.toFixed(2),
        paidKH:        isABA ? 0 : paymentKH,
        paidUSD:       isABA ? totalUSD : paymentUSD,
        items
    };
}

function generateInvoiceNumber() {
    const today   = new Date();
    const yyyy    = today.getFullYear();
    const mm      = String(today.getMonth() + 1).padStart(2, '0');
    const dd      = String(today.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}${mm}${dd}`;
    let lastDate  = localStorage.getItem("invoiceDate");
    let counter   = parseInt(localStorage.getItem("invoiceCounter")) || 0;
    counter       = (lastDate !== dateKey) ? 1 : counter + 1;
    localStorage.setItem("invoiceDate",    dateKey);
    localStorage.setItem("invoiceCounter", counter);
    return `${dateKey}-${String(counter).padStart(3, '0')}`;
}

/* ══════════════════════════════════════════════════
   ABA PAYMENT
══════════════════════════════════════════════════ */
function handleABAPayment(method) {
    const rows = document.querySelectorAll("#table-item tr:not(.comment-row)");
    if (rows.length === 0) { alert("Please add items first."); return; }
    const totalUSD = parseFloat(document.getElementById("totalPriceUSD").innerText) || 0;
    if (totalUSD <= 0) { alert("Total is 0."); return; }

    const orderData = buildOrderData(method);

    fetch("http://localhost:3000/api/save-invoice", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(orderData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            sendTelegram(orderData);
            removePaidOrder();
            paymentKH = 0; paymentUSD = 0;
            document.getElementById("table-item").innerHTML = "";
            calculateTotal();
            printReceipt(orderData);
        }
    })
    .catch(err => {
        console.error("ABA payment error:", err);
        alert("Server error. Check console.");
    });
}

/* ══════════════════════════════════════════════════
   PAYMENT SUMMARY POPUP
══════════════════════════════════════════════════ */
function showPaymentSummary() {
    const totalUSD     = parseFloat(document.getElementById("totalPriceUSD").innerText) || 0;
    const paidTotalUSD = paymentUSD + (paymentKH / 4000);
    let changeUSD = 0, changeKH = 0;
    if (paidTotalUSD >= totalUSD && totalUSD > 0) {
        changeUSD = paidTotalUSD - totalUSD;
        changeKH  = changeUSD * 4000;
    }
    document.getElementById("sumCashKH").innerText    = paymentKH  > 0 ? paymentKH.toLocaleString() + " ៛" : "0 ៛";
    document.getElementById("sumCashUSD").innerText   = paymentUSD > 0 ? "$ " + paymentUSD.toFixed(2)       : "$ 0.00";
    document.getElementById("sumChangeKH").innerText  = Math.round(changeKH).toLocaleString() + " ៛";
    document.getElementById("sumChangeUSD").innerText = "$ " + changeUSD.toFixed(2);
    document.getElementById("paymentSummaryModal").style.display = "flex";
}

/* ══════════════════════════════════════════════════
   SUMMARY MODAL BUTTONS
══════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("summaryConfirm").addEventListener("click", function () {
        const totalUSD     = parseFloat(document.getElementById("totalPriceUSD").innerText) || 0;
        const paidTotalUSD = paymentUSD + (paymentKH / 4000);
        if (paidTotalUSD < totalUSD) { alert("Customer did not pay enough."); return; }

        document.getElementById("paymentSummaryModal").style.display = "none";
        const orderData = buildOrderData("Cash");

        fetch("http://localhost:3000/api/save-invoice", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(orderData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                sendTelegram(orderData);
                removePaidOrder();
                document.getElementById("table-item").innerHTML = "";
                paymentKH = 0; paymentUSD = 0;
                calculateTotal();
                printReceipt(orderData);
            }
        })
        .catch(err => {
            console.error("Cash payment error:", err);
            alert("Server error. Check console.");
        });
    });

    document.getElementById("summaryCancel").addEventListener("click", function () {
        document.getElementById("paymentSummaryModal").style.display = "none";
        keypadMode = "PAYMENT";
        keypad.style.display = "flex";
        if (paymentKH  > 0) { currentInput = document.getElementById("cashKHPayment");  display.innerText = paymentKH; }
        if (paymentUSD > 0) { currentInput = document.getElementById("cashUSDPayment"); display.innerText = paymentUSD; }
    });
});

/* ══════════════════════════════════════════════════
   REMOVE TRANSACTION
══════════════════════════════════════════════════ */
// this  this for removetransation alert for comfirm remove 
// document.getElementById("removeTransaction").addEventListener("click", cancelTransaction);

async function cancelTransaction() {
    

    

    const orderData = buildOrderData("Cancelled");

    try {
        const saveRes  = await fetch("http://localhost:3000/api/save-invoice", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(orderData)
        });
        const saveData = await saveRes.json();
        if (!saveData.success) { alert("Failed to save before deleting."); return; }

        const delRes  = await fetch("http://localhost:3000/api/delete-invoice", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ invoiceID: orderData.invoiceID })
        });
        console.log("Deleted:", await delRes.json());
    } catch (err) {
        console.error("Remove transaction error:", err);
        alert("Server error. Check console.");
        return;
    }

    removePaidOrder();
    document.getElementById("table-item").innerHTML = "";
    paymentKH  = 0;
    paymentUSD = 0;
    calculateTotal();
    // alert("Transaction removed.");

    // this go back DineIn
    window.location.href = "../Navbar/DineIn.html";
    
}
// for confirmremovetransaion when click
async function confirmRemoveTransaction() {
    document.getElementById("removeTransactionModal").style.display = "none";
    await cancelTransaction();
}

function removePaidOrder() {
    let orders = JSON.parse(localStorage.getItem("dineInOrders")) || [];
    orders = orders.filter(o => o.table !== selectedTable);
    localStorage.setItem("dineInOrders", JSON.stringify(orders));
}

function resetAfterPayment() {
    document.getElementById("table-item").innerHTML = "";
    paymentKH = 0; paymentUSD = 0;
    keypadMode = null;
    display.innerText = "0";
    keypad.style.display = "none";
    calculateTotal();
}
// this block for the pop remevetransation
function openRemoveTransactionModal() {
    const rows = document.querySelectorAll("#table-item tr:not(.comment-row)");
    if (rows.length === 0) { alert("No order to remove."); return; }
    const totalUSD = parseFloat(document.getElementById("totalPriceUSD").innerText) || 0;
    document.getElementById("removeTransactionModal").style.display = "flex";
}

function cancelRemoveTransaction() {
    document.getElementById("removeTransactionModal").style.display = "none";
}


/* ══════════════════════════════════════════════════
   KEYPAD
══════════════════════════════════════════════════ */
const KhpaymentInput = document.getElementById('cashKHPayment');
const UspaymentInput = document.getElementById('cashUSDPayment');
const keypad         = document.getElementById('keypad');
const display        = document.getElementById('display');
let currentInput     = null;

KhpaymentInput.addEventListener('click', () => {
    if (paymentKH > 0) { showPaymentSummary(); return; }
    keypadMode = "PAYMENT"; currentInput = KhpaymentInput;
    display.innerText = "0"; keypad.style.display = 'flex';
});

UspaymentInput.addEventListener('click', () => {
    if (paymentUSD > 0) { showPaymentSummary(); return; }
    keypadMode = "PAYMENT"; currentInput = UspaymentInput;
    display.innerText = "0"; keypad.style.display = 'flex';
});

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        const val = key.innerText;
        if (key.classList.contains('del')) {
            display.innerText = display.innerText.slice(0, -1) || '0';
            return;
        }
        if (keypadMode === "TABLE" && val === ".") return;
        if (val === '.' && display.innerText.includes('.')) return;
        display.innerText = (display.innerText === '0' && val !== '.') ? val : display.innerText + val;
    });
});

document.getElementById('ok').addEventListener('click', () => {
    if (keypadMode === "TABLE") {
        if (display.innerText === "0") { alert("Please enter table number"); return; }
        selectedTable = "Table " + display.innerText;
        localStorage.setItem("selectedTable", selectedTable);
        keypad.style.display = "none";
        startOrderScreen();
        return;
    }
    if (keypadMode === "PAYMENT" && currentInput) {
        const amount = parseFloat(display.innerText) || 0;
        if (currentInput.id === "cashKHPayment")  paymentKH  = amount;
        if (currentInput.id === "cashUSDPayment") paymentUSD = amount;
        calculateTotal();
    }
    keypad.style.display = "none";
});

document.getElementById('cancel').addEventListener('click', () => {
    keypad.style.display = 'none';
});