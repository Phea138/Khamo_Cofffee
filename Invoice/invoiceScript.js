// ── Read data saved by NewScript.js ──────────────────────
    const data = JSON.parse(localStorage.getItem("receiptData") || "{}");

    // ── Invoice ID  (timestamp based) ────────────────────────
    document.getElementById("invoiceID").innerText = data.invoiceID || "-";

    // ── Table ────────────────────────────────────────────────
    document.getElementById("tableNumber").innerText = data.table || "-";

     // ── Order Type: "Dine in" or "Takeaway" ───────────────────
    document.getElementById("orderTypeDisplay").innerText =
    data.orderType || "Dine In";

    // ── Date & Time ──────────────────────────────────────────
    const now = data.time ? new Date(data.time) : new Date();
    const day   = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year  = now.getFullYear();
    document.getElementById("orderDate").innerText = `Date:${day}-${month}-${year}`;

    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    document.getElementById("orderTime").innerText = `Time: ${hh}:${mm}:${ss}`;

    // ── Items ────────────────────────────────────────────────
    const tbody = document.getElementById("receiptItems");
    const items = data.items || [];

    items.forEach(item => {
        const tr = document.createElement("tr");

        // Description = name + size
        // const desc = `${item.name} -${item.size ? item.size.toLowerCase() : ""}`;
        const desc = `${item.category || ""} - ${item.name} ${item.size || ""}`;

        // Discount display (e.g. "10%")
        const discPct = parseFloat(item.discount) || 0;
        const discDisplay = discPct > 0 ? discPct + "%" : "0%";

        tr.innerHTML = `
            <td>${desc}</td>
            <td>${item.qty}</td>
            <td>${parseFloat(item.price).toFixed(2)}</td>
            <td>${discDisplay}</td>
            <td>${parseFloat(item.total).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });

    // ── Grand Totals ─────────────────────────────────────────
    const totalUSD = parseFloat(data.totalUSD) || 0;
    const totalKH  = Math.round(totalUSD * 4000);

    document.getElementById("grandTotalUSD").innerText = totalUSD.toFixed(2);
    document.getElementById("grandTotalKH").innerText  = totalKH.toLocaleString();

    // ── Payment Method & Amount ──────────────────────────────
    // const paidKH  = parseFloat(data.paidKH)  || 0;
    // const paidUSD = parseFloat(data.paidUSD) || 0;

    // // Build method string  e.g. "Cash KH/Cash USD" or just "Cash KH"
    // let methods = [];
    // if (paidKH  > 0) methods.push("Cash KH");
    // if (paidUSD > 0) methods.push("Cash USD");
    // if (methods.length === 0) methods.push("Cash");

    // document.getElementById("payMethod").innerText = methods.join("/");

    // // Amount string  e.g. "85500/21.37"  or  "85500"  or  "21.37"
    // let amountParts = [];
    // if (paidKH  > 0) amountParts.push(Math.round(paidKH).toLocaleString());
    // if (paidUSD > 0) amountParts.push(paidUSD.toFixed(2));
    // document.getElementById("payAmount").innerText = amountParts.join("/");

    const paymentMethod = data.paymentMethod || "Cash";
    const paidKH        = parseFloat(data.paidKH)  || 0;
    const paidUSD       = parseFloat(data.paidUSD) || 0;

    document.getElementById("payMethod").innerText = paymentMethod;

    // For ABA: show just the total amount
    // For Cash: show KH amount / USD amount
    const isABA =
    paymentMethod === "ABA QR" ||
    paymentMethod === "ABA Card" ||
    paymentMethod === "ABA Cash";

    if (isABA) {
        // ABA pays exact total
        document.getElementById("payAmount").innerText = "$" + totalUSD.toFixed(2);
    } else {
        // Cash: show whatever was paid
        let parts = [];
        if (paidKH  > 0) parts.push(Math.round(paidKH).toLocaleString() + "R");
        if (paidUSD > 0) parts.push("$" + paidUSD.toFixed(2));
        document.getElementById("payAmount").innerText = parts.join("/");
    }

    // ── Auto print when opened ───────────────────────────────
    // window.onload = function () {
    //     // Small delay so content renders first
    //     setTimeout(() => window.print(), 600);
    // };
    window.onload = function () {

    setTimeout(() => {
        window.print();

        // After print → close invoice window
        window.onafterprint = function () {
            window.close();
        };

    }, 600);
};