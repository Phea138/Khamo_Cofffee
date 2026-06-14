//  /* ── DATA ───────────────────────────── */
// // async function getPaid() {

// //     const res = await fetch("http://localhost:3000/api/transactions");
// //     const data = await res.json();

// //     return data.map(row => ({
// //         invoiceID: row.invoiceID,
// //         table: row.tableName,
// //         orderType: row.orderType,
// //         paymentMethod: row.paymentMethod,
// //         time: row.time,
// //         totalUSD: row.totalUSD
// //     }));

// // }
// async function getPaid() {

//     const res = await fetch("http://localhost:3000/api/transactions");
//     const data = await res.json();

//     return data.filter(o => o.status === "PAID");
// }


// // function getDel() { return JSON.parse(localStorage.getItem('deletedOrders') || '[]'); }
// async function getDel() {

//     const res = await fetch("http://localhost:3000/api/transactions");
//     const data = await res.json();

//     return data.filter(o => o.status === "DELETED");
// }


// /* ── FORMAT ─────────────────────────── */
// function fid(id) { return '#' + String(id).slice(-6).padStart(6, '0'); }
// function fdt(t) {
//   try {
//     const d = new Date(t); if (isNaN(d)) return t || '-';
//     const p = v => String(v).padStart(2, '0');
//     return `${p(d.getDate())}-${p(d.getMonth()+1)}-${d.getFullYear()}  ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
//   } catch { return t || '-'; }
// }
// function pbadge(m) {
//   const l = (m || '').toLowerCase();
//   if (l.includes('aba qr'))   return `<span class="badge ba">ABA QR</span>`;
//   if (l.includes('aba card')) return `<span class="badge bk">ABA Card</span>`;
//   return `<span class="badge bc">${m || 'Cash'}</span>`;
// }
// function emptyRow(cols, msg) {
//   return `<tr><td colspan="${cols}"><div class="empty">
//     <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
//       <path stroke-linecap="round" stroke-linejoin="round"
//             d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/>
//     </svg>${msg}</div></td></tr>`;
// }


// /* ── RENDER PAID ────────────────────── */
// async function rPaid() {

//   const data = await getPaid();
//   const tot  = data.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);
//   const cnt  = data.length;
//   document.getElementById('pr').textContent = '$' + tot.toFixed(2);
//   document.getElementById('pc').textContent = cnt;
//   document.getElementById('pa').textContent = '$' + (cnt ? tot/cnt : 0).toFixed(2);
//   document.getElementById('pp').textContent = cnt;

//   const tb = document.getElementById('pb');
//   if (!cnt) { tb.innerHTML = emptyRow(5, 'No paid transactions yet'); return; }
//   tb.innerHTML = data.map(o => `
//     <tr data-q="${fid(o.invoiceID)} ${(o.table||'').toLowerCase()}">
//       <td class="mono">${fid(o.invoiceID)}</td>
//       <td>${o.table || '-'} <small style="color:var(--muted);font-size:11px;">${o.orderType||''}</small></td>
//       <td style="font-size:12.5px;color:var(--muted)">${fdt(o.time)}</td>
//       <td>${pbadge(o.paymentMethod)}</td>
//       <td class="amt-g">$${parseFloat(o.totalUSD||0).toFixed(2)}</td>
//     </tr>`).join('');
// }

//  function openDeleted(invoiceID){

//     // open New order page and send invoiceID
//     window.location.href =
//     "/StartOrder/New.html?deleted=" + invoiceID;

// }

// /* ── RENDER DELETED ─────────────────── */
// // function rDel() {
// //   const data = getDel();
// //   const cnt  = data.length;
// //   const tot  = data.reduce((s, o) => s + parseFloat(o.total || o.totalUSD || 0), 0);
// //   document.getElementById('dc').textContent = cnt;
// //   document.getElementById('da').textContent = '$' + tot.toFixed(2);
// //   document.getElementById('pd').textContent = cnt;

// //   const tb = document.getElementById('db');
// //   if (!cnt) { tb.innerHTML = emptyRow(5, 'No deleted transactions'); return; }
// //   // tb.innerHTML = data.map(o => `
// //   //   <tr data-q="${fid(o.id||o.invoiceID)} ${(o.table||'').toLowerCase()}">
// //   //     <td class="mono">${fid(o.id || o.invoiceID)}</td>
// //   //     <td>${o.table || '-'}</td>
// //   //     <td style="font-size:12.5px;color:var(--muted)">${fdt(o.time)}</td>
// //   //     <td><span class="badge bd">Cancelled</span></td>
// //   //     <td class="amt-r">$${parseFloat(o.total||o.totalUSD||0).toFixed(2)}</td>
// //   //   </tr>`).join('');
// //   tb.innerHTML = data.map(o => `
// // <tr onclick="openDeleted('${o.invoiceID}')"
// // data-q="${fid(o.id||o.invoiceID)} ${(o.table||'').toLowerCase()}">

// // <td class="mono">${fid(o.id || o.invoiceID)}</td>
// // <td>${o.table || '-'}</td>
// // <td style="font-size:12.5px;color:var(--muted)">${fdt(o.time)}</td>
// // <td><span class="badge bd">Cancelled</span></td>
// // <td class="amt-r">$${parseFloat(o.total||o.totalUSD||0).toFixed(2)}</td>

// // </tr>`).join('');
// // }
// async function rDel() {

//   const data = await getDel();

//   const cnt  = data.length;
//   const tot  = data.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);

//   document.getElementById('dc').textContent = cnt;
//   document.getElementById('da').textContent = '$' + tot.toFixed(2);
//   document.getElementById('pd').textContent = cnt;

//   const tb = document.getElementById('db');

//   if (!cnt) {
//     tb.innerHTML = emptyRow(5, 'No deleted transactions');
//     return;
//   }

//   tb.innerHTML = data.map(o => `
// <tr onclick="openDeleted('${o.invoiceID}')">
// <td class="mono">${fid(o.invoiceID)}</td>
// <td>${o.table || '-'}</td>
// <td>${fdt(o.time)}</td>
// <td><span class="badge bd">Cancelled</span></td>
// <td class="amt-r">$${parseFloat(o.totalUSD||0).toFixed(2)}</td>
// </tr>`).join('');
// }

// /* ── EXPORT PREVIEW ─────────────────── */
// // function getFiltered() {
// //   const s = document.getElementById('ds').value;
// //   const e = document.getElementById('de').value;
// //   return getPaid().filter(o => {
// //     if (!s && !e) return true;
// //     const ds = new Date(o.time).toISOString().split('T')[0];
// //     if (s && ds < s) return false;
// //     if (e && ds > e) return false;
// //     return true;
// //   });
// // }
// async function getFiltered() {

//   const data = await getPaid();

//   const sd = document.getElementById('ds').value;
//   const ed = document.getElementById('de').value;
//   const st = document.getElementById('ts').value || "00:00";
//   const et = document.getElementById('te').value || "23:59";

//   const start = sd ? new Date(sd + "T" + st) : null;
//   const end   = ed ? new Date(ed + "T" + et) : null;

//   return data.filter(o => {

//     const t = new Date(o.time);

//     if (start && t < start) return false;
//     if (end && t > end) return false;

//     return true;
//   });

// }
// async function rp() { 
//   const rows = await getFiltered();
//   // const allP = getPaid(), allD = getDel();
//   const allP = await getPaid();
//   const allD = await getDel();
//   const fsum = rows.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);
//   document.getElementById('etp').textContent = '$' + allP.reduce((s,o)=>s+parseFloat(o.totalUSD||0),0).toFixed(2);
//   document.getElementById('etc').textContent = allP.length;
//   document.getElementById('efa').textContent = '$' + fsum.toFixed(2);
//   document.getElementById('ede').textContent = allD.length;

//   const tb = document.getElementById('xb');
//   if (!rows.length) {
//     tb.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--muted);font-style:italic;">No records in selected range</td></tr>`;
//     return;
//   }
//   // tb.innerHTML = rows.map(o => `
//   //     <tr>
//   //     <td class="mono"> 
//   //     <a href="../NewOrder/New.html?deleted=${o.invoiceID}" style="color:inherit;text-decoration:underline;">
//   //     ${fid(o.id || o.invoiceID)}
//   //     </a>
//   //     </td>
//   //     <td>${o.table || '-'}</td>
//   //     <td style="font-size:12.5px;color:var(--muted)">${fdt(o.time)}</td>
//   //     <td>${pbadge(o.paymentMethod)}</td>
//   //     <td class="amt-g">$${parseFloat(o.totalUSD||0).toFixed(2)}</td>
//   //   </tr>`).join('');

// tb.innerHTML = rows.map(o => `
// <tr>
// <td class="mono">
// <a href="/StartOrder/New.html?deleted=${o.invoiceID}">
// ${fid(o.invoiceID)}
// </a>
// </td>
// <td>${o.table || '-'}</td>
// <td>${fdt(o.time)}</td>
// <td>${pbadge(o.paymentMethod)}</td>
// <td class="amt-g">$${parseFloat(o.totalUSD||0).toFixed(2)}</td>
// </tr>
// `).join('');


// //   tb.innerHTML = data.map(o => `
// // <tr data-q="${fid(o.id||o.invoiceID)} ${(o.table||'').toLowerCase()}">
// // <td class="mono">
// // <a href="../NewOrder/New.html?deleted=${o.invoiceID}" 
// // style="color:inherit;text-decoration:underline;">
// // ${fid(o.id || o.invoiceID)}
// // </a>
// // </td>
// // <td>${o.table || '-'}</td>
// // <td style="font-size:12.5px;color:var(--muted)">${fdt(o.time)}</td>
// // <td><span class="badge bd">Cancelled</span></td>
// // <td class="amt-r">$${parseFloat(o.total||o.totalUSD||0).toFixed(2)}</td>
// // </tr>`).join('');
// }

// /* ── EXPORT XLSX ────────────────────── */
// function doExport() {
//   const rows = getFiltered();
//   if (!rows.length) { alert('No records to export in selected range.'); return; }
//   const s1 = rows.map((o, i) => ({
//     'No': i+1, 'Invoice ID': fid(o.invoiceID), 'Table': o.table||'-',
//     'Order Type': o.orderType||'Dine in', 'Date/Time': fdt(o.time),
//     'Payment Method': o.paymentMethod||'Cash', 'Amount (USD)': parseFloat(o.totalUSD||0).toFixed(2)
//   }));
//   const wb = XLSX.utils.book_new();
//   const ws1 = XLSX.utils.json_to_sheet(s1);
//   ws1['!cols'] = [{wch:4},{wch:13},{wch:12},{wch:14},{wch:22},{wch:16},{wch:13}];
//   XLSX.utils.book_append_sheet(wb, ws1, 'Transaction Paid');
//   const del = getDel();
//   if (del.length) {
//     const s2 = del.map((o,i) => ({
//       'No': i+1, 'Invoice ID': fid(o.id||o.invoiceID), 'Table': o.table||'-',
//       'Date/Time': fdt(o.time), 'Amount': parseFloat(o.total||o.totalUSD||0).toFixed(2), 'Status':'Cancelled'
//     }));
//     XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(s2), 'Transaction Deleted');
//   }
//   const s = document.getElementById('ds').value || 'all';
//   const e = document.getElementById('de').value || 'today';
//   XLSX.writeFile(wb, `CoffeeShop_${s}_to_${e}.xlsx`);
// }


// /* ── SEARCH ─────────────────────────── */
// function filt(tbId, q) {
//   q = q.toLowerCase().trim();
//   document.querySelectorAll(`#${tbId} tr[data-q]`).forEach(r => {
//     r.style.display = (r.dataset.q + r.innerText.toLowerCase()).includes(q) ? '' : 'none';
//   });
// }

// /* ── PAGE SWITCH ────────────────────── */
// function show(name) {
//   ['paid','deleted','export'].forEach(p => {
//     document.getElementById('pg-'+p).classList.toggle('show', p === name);
//     const nb = document.getElementById('nb-'+p);
//     nb.classList.remove('on', 'on-r');
//     if (p === name) {
//       if (name === 'deleted') nb.classList.add('on-r');
//       else nb.classList.add('on');
//     }
//   });
// }

// /* ── ABSORB NEW RECEIPT ─────────────── */
// function absorbReceipt() {
//   const raw = localStorage.getItem('receiptData');
//   if (!raw) return;
//   const d = JSON.parse(raw);
//   if (!d || !d.invoiceID) return;
//   let h = JSON.parse(localStorage.getItem('receiptHistory') || '[]');
//   if (!h.find(x => String(x.invoiceID) === String(d.invoiceID))) {
//     h.unshift(d);
//     localStorage.setItem('receiptHistory', JSON.stringify(h));
//   }
// }

// /* ── INIT ───────────────────────────── */
// absorbReceipt();
// rPaid();
// rDel();
// const today = new Date();
// const ago   = new Date(); ago.setDate(today.getDate() - 30);
// document.getElementById('de').value = today.toISOString().split('T')[0];
// document.getElementById('ds').value = ago.toISOString().split('T')[0];
// rp();


/* ══════════════════════════════════════════════════
   DATA  —  all from MySQL via server.js
══════════════════════════════════════════════════ */
// async function fetchAll() {
//     const res = await fetch("http://localhost:3000/api/transactions");
//     return await res.json();
// }

async function fetchAll() {
    const res = await fetch("http://localhost:3000/api/transactions/export");// for export all data in db
    return await res.json();
}

function todayStr() {
    const d = new Date();
    const p = v => String(v).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
}

function isToday(timeStr) {
    try {
        const d = new Date(timeStr);
        if (isNaN(d)) return false;
        const p  = v => String(v).padStart(2, '0');
        const ds = `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
        return ds === todayStr();
    } catch { return false; }
}

async function getPaidToday() {
    const all = await fetchAll();
    return all.filter(o => o.status === 'PAID' && isToday(o.time));
}

async function getDelToday() {
    const all = await fetchAll();
    return all.filter(o => o.status === 'DELETED' && isToday(o.time));
}

async function getAllPaid() {
    const all = await fetchAll();
    return all.filter(o => o.status === 'PAID');
}

async function getAllDel() {
    const all = await fetchAll();
    return all.filter(o => o.status === 'DELETED');
}

/* ══════════════════════════════════════════════════
   FORMAT HELPERS
══════════════════════════════════════════════════ */
function fid(id) {
    return '#' + String(id).slice(-6).padStart(6, '0');
}

function fdt(t) {
    try {
        const d = new Date(t);
        if (isNaN(d)) return t || '-';
        const p = v => String(v).padStart(2, '0');
        return `${p(d.getDate())}-${p(d.getMonth()+1)}-${d.getFullYear()}  ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    } catch { return t || '-'; }
}

function pbadge(m) {
    const l = (m || '').toLowerCase();
    if (l.includes('aba qr'))   return `<span class="badge ba">ABA QR</span>`;
    if (l.includes('aba card')) return `<span class="badge bk">ABA Card</span>`;
    return `<span class="badge bc">${m || 'Cash'}</span>`;
}

function emptyRow(cols, msg) {
    return `<tr><td colspan="${cols}"><div class="empty">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
               M9 5a2 2 0 002 2h2a2 2 0 002-2"/>
        </svg>${msg}
    </div></td></tr>`;
}

/* ══════════════════════════════════════════════════
   RENDER PAID  (today only)
   Click row → New.html?view=INVOICEID
══════════════════════════════════════════════════ */
async function rPaid() {
    const data = await getPaidToday();
    const tot  = data.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);
    const cnt  = data.length;

    document.getElementById('pr').textContent = '$' + tot.toFixed(2);
    document.getElementById('pc').textContent = cnt;
    document.getElementById('pa').textContent = '$' + (cnt ? tot / cnt : 0).toFixed(2);
    document.getElementById('pp').textContent = cnt;

    const tb = document.getElementById('pb');
    if (!cnt) { tb.innerHTML = emptyRow(5, 'No paid transactions today'); return; }

    tb.innerHTML = data.map(o => `
        <tr data-q="${fid(o.invoiceID)} ${(o.table||'').toLowerCase()}"
            onclick="openPaid('${o.invoiceID}')"
            style="cursor:pointer;">
            <td class="mono">${fid(o.invoiceID)}</td>
            <td>${o.table || '-'}
                <small style="color:var(--muted);font-size:11px;">${o.orderType || ''}</small>
            </td>
            <td style="font-size:12.5px;color:var(--muted)">${fdt(o.time)}</td>
            <td>${pbadge(o.paymentMethod)}</td>
            <td class="amt-g">$${parseFloat(o.totalUSD || 0).toFixed(2)}</td>
        </tr>`).join('');
}

function openPaid(invoiceID) {
    window.location.href = "/Khamo POS/POS_SYSTEM/StartOrder/New.html?view=" + invoiceID;
}

/* ══════════════════════════════════════════════════
   RENDER DELETED  (today only)
   Click row → New.html?deleted=INVOICEID
══════════════════════════════════════════════════ */
function openDeleted(invoiceID) {
    window.location.href = "/Khamo POS/POS_SYSTEM/StartOrder/New.html?deleted=" + invoiceID;
}

async function rDel() {
    const data = await getDelToday();
    const cnt  = data.length;
    const tot  = data.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);

    document.getElementById('dc').textContent = cnt;
    document.getElementById('da').textContent = '$' + tot.toFixed(2);
    document.getElementById('pd').textContent = cnt;

    const tb = document.getElementById('db');
    if (!cnt) { tb.innerHTML = emptyRow(5, 'No deleted transactions today'); return; }

    tb.innerHTML = data.map(o => `
        <tr onclick="openDeleted('${o.invoiceID}')"
            data-q="${fid(o.invoiceID)} ${(o.table||'').toLowerCase()}"
            style="cursor:pointer;">
            <td class="mono">${fid(o.invoiceID)}</td>
            <td>${o.table || '-'}</td>
            <td style="font-size:12.5px;color:var(--muted)">${fdt(o.time)}</td>
            <td><span class="badge bd">Cancelled</span></td>
            <td class="amt-r">$${parseFloat(o.totalUSD || 0).toFixed(2)}</td>
        </tr>`).join('');
}

/* ══════════════════════════════════════════════════
   EXPORT FILTER  (by date + time range)
══════════════════════════════════════════════════ */
function getDateRange() {
    return {
        sd: document.getElementById('ds').value,
        ed: document.getElementById('de').value,
        st: document.getElementById('ts').value || "00:00",
        et: document.getElementById('te').value || "23:59"
    };
}

function filterByRange(data, sd, ed, st, et) {
    const start = sd ? new Date(sd + "T" + st) : null;
    const end   = ed ? new Date(ed + "T" + et) : null;
    return data.filter(o => {
        const t = new Date(o.time);
        if (start && t < start) return false;
        if (end   && t > end)   return false;
        return true;
    });
}

async function getFiltered() {
    const { sd, ed, st, et } = getDateRange();
    const data = await getAllPaid();
    return filterByRange(data, sd, ed, st, et);
}

/* ══════════════════════════════════════════════════
   UPDATE EXPORT SUMMARY CARDS
   ── Cards start at $0.00 / 0 on page load ──
   ── Only update when seller picks a date/time ──
══════════════════════════════════════════════════ */

// Track whether seller has selected any date/time
let exportRangeSelected = false;

function resetExportCards() {
    document.getElementById('etp').textContent = '$0.00';
    document.getElementById('etc').textContent = '0';
    document.getElementById('efa').textContent = '$0.00';
    document.getElementById('ede').textContent = '0';
}

async function rp() {
    // Only run if seller has actually picked a date
    if (!exportRangeSelected) return;

    const { sd, ed, st, et } = getDateRange();

    // Must have at least a start date to show results
    if (!sd && !ed) {
        resetExportCards();
        return;
    }

    const [allPaid, allDel] = await Promise.all([getAllPaid(), getAllDel()]);

    const filteredPaid = filterByRange(allPaid, sd, ed, st, et);
    const filteredDel  = filterByRange(allDel,  sd, ed, st, et);

    const totalPaid   = filteredPaid.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);
    const totalDel    = filteredDel.reduce((s, o)  => s + parseFloat(o.totalUSD || 0), 0);

    document.getElementById('etp').textContent = '$' + totalPaid.toFixed(2);
    document.getElementById('etc').textContent = filteredPaid.length;
    document.getElementById('efa').textContent = '$' + totalDel.toFixed(2);
    document.getElementById('ede').textContent = filteredDel.length;
}

// Called when any date/time input changes
function onRangeChange() {
    exportRangeSelected = true;
    rp();
}

/* ══════════════════════════════════════════════════
   FORMAT DATE FOR EXCEL HEADER "DD-MM-YYYY HH:MM"
══════════════════════════════════════════════════ */
function fmtExcelDate(dateStr, timeStr) {
    if (!dateStr) return '-';
    const [y, m, d] = dateStr.split('-');
    const t = timeStr || '00:00';
    return `${d}-${m}-${y} ${t}`;
}

/* ══════════════════════════════════════════════════
   EXPORT TO EXCEL
   Fetches from DB, filtered by selected date/time
   Sheet 1 — Summary row (your screenshot format)
   Sheet 2 — Transaction Paid detail
   Sheet 3 — Transaction Deleted detail
══════════════════════════════════════════════════ */
async function doExport() {

    const { sd, ed, st, et } = getDateRange();

    if (!sd && !ed) {
        alert('Please select at least a Start Date before exporting.');
        return;
    }

    // Fetch from DB and filter
    const [allPaid, allDel] = await Promise.all([getAllPaid(), getAllDel()]);

    const rows        = filterByRange(allPaid, sd, ed, st, et);
    const delFiltered = filterByRange(allDel,  sd, ed, st, et);

    if (!rows.length && !delFiltered.length) {
        alert('No records found in the selected date/time range.');
        return;
    }

    // ── Summary numbers ─────────────────────────────
    const amountPaid = rows.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);
    const countPaid  = rows.length;
    const amountDel  = delFiltered.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);
    const countDel   = delFiltered.length;

    // Payment method breakdown
    const matchPay = (o, keyword) => (o.paymentMethod || '').toLowerCase().includes(keyword);
    const sumBy    = (arr, kw) => arr.filter(o => matchPay(o, kw))
                                     .reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);

    const cashKH   = sumBy(rows, 'cash kh');
    const cashUSD  = rows.filter(o => {
                         const m = (o.paymentMethod||'').toLowerCase();
                         return m.includes('cash usd') || m === 'cash';
                     }).reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);
    const bankQR   = sumBy(rows, 'aba qr');
    const bankCard = sumBy(rows, 'aba card');

    // ── Date range label ─────────────────────────────
    const startLabel = fmtExcelDate(sd, st);
    const endLabel   = fmtExcelDate(ed, et);
    const dateRange  = `Total Sale ${startLabel} To ${endLabel}`;

    // ── Styles ───────────────────────────────────────
    const borderThin = {
        top:    { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left:   { style: "thin", color: { rgb: "CCCCCC" } },
        right:  { style: "thin", color: { rgb: "CCCCCC" } }
    };
    const borderDark = {
        top:    { style: "thin", color: { rgb: "444444" } },
        bottom: { style: "thin", color: { rgb: "444444" } },
        left:   { style: "thin", color: { rgb: "444444" } },
        right:  { style: "thin", color: { rgb: "444444" } }
    };
    const center = { horizontal: "center", vertical: "center", wrapText: true };
    const left   = { horizontal: "left",   vertical: "center" };

    const wb = XLSX.utils.book_new();

    /* ════════════════════════════════════════════════
       SHEET 1 — SUMMARY
    ════════════════════════════════════════════════ */
    const summaryData = [
        [
            dateRange,
            'Amount Transaction Paid',
            'Total Transaction Paid',
            'Amount Deleted Transaction',
            'Total Deleted Transaction',
            'Total Cash KH',
            'Total Cash USD',
            'Total Bank QR',
            'Total Bank Card'
        ],
        [
            '',
            '$' + amountPaid.toFixed(2),
            countPaid,
            '$' + amountDel.toFixed(2),
            countDel,
            '$' + cashKH.toFixed(2),
            '$' + cashUSD.toFixed(2),
            '$' + bankQR.toFixed(2),
            '$' + bankCard.toFixed(2)
        ]
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

    wsSummary['!cols'] = [
        {wch:34},{wch:24},{wch:22},{wch:28},{wch:26},
        {wch:16},{wch:16},{wch:16},{wch:16}
    ];
    wsSummary['!rows'] = [{ hpt: 38 }, { hpt: 28 }];

    // Header row — dark background
    ['A','B','C','D','E','F','G','H','I'].forEach(col => {
        const cell = wsSummary[col + '1'];
        if (cell) cell.s = {
            fill:      { patternType: "solid", fgColor: { rgb: "1E1410" } },
            font:      { bold: true, color: { rgb: "FDEBD0" }, sz: 10 },
            alignment: center,
            border:    borderDark
        };
    });

    // Value row — warm cream background
    ['A','B','C','D','E','F','G','H','I'].forEach(col => {
        const cell = wsSummary[col + '2'];
        if (cell) cell.s = {
            fill:      { patternType: "solid", fgColor: { rgb: "FDF6EC" } },
            font:      { bold: true, sz: 11, color: { rgb: "1A5276" } },
            alignment: center,
            border:    borderDark
        };
    });

    XLSX.utils.book_append_sheet(wb, wsSummary, '📊 Summary');

    /* ════════════════════════════════════════════════
       SHEET 2 — TRANSACTION PAID
    ════════════════════════════════════════════════ */
    if (rows.length) {
        const paidAOA = [
            ['No','Invoice ID','Table','Order Type','Date / Time','Payment Method','Amount (USD)'],
            ...rows.map((o, i) => [
                i + 1,
                fid(o.invoiceID),
                o.table || '-',
                o.orderType || 'Dine in',
                fdt(o.time),
                o.paymentMethod || 'Cash',
                parseFloat(o.totalUSD || 0).toFixed(2)
            ])
        ];

        const wsPaid = XLSX.utils.aoa_to_sheet(paidAOA);
        wsPaid['!cols'] = [{wch:5},{wch:16},{wch:12},{wch:13},{wch:23},{wch:16},{wch:14}];
        wsPaid['!rows'] = [{ hpt: 30 }];

        // Header
        ['A','B','C','D','E','F','G'].forEach(col => {
            const cell = wsPaid[col + '1'];
            if (cell) cell.s = {
                fill:      { patternType: "solid", fgColor: { rgb: "1A5276" } },
                font:      { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
                alignment: center,
                border:    borderDark
            };
        });

        // Zebra data rows
        rows.forEach((_, i) => {
            const row = i + 2;
            const bg  = i % 2 === 0 ? "FFFFFF" : "EBF5FB";
            ['A','B','C','D','E','F','G'].forEach(col => {
                const cell = wsPaid[col + row];
                if (cell) cell.s = {
                    fill:      { patternType: "solid", fgColor: { rgb: bg } },
                    font:      { sz: 10 },
                    alignment: col === 'E' ? left : center,
                    border:    borderThin
                };
            });
        });

        // Total row at the bottom
        const totalRow = rows.length + 2;
        const totalAmt = rows.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);
        XLSX.utils.sheet_add_aoa(wsPaid,
            [['', '', '', '', '', 'TOTAL', '$' + totalAmt.toFixed(2)]],
            { origin: `A${totalRow}` }
        );
        ['A','B','C','D','E','F','G'].forEach(col => {
            const cell = wsPaid[col + totalRow];
            if (!cell) return;
            cell.s = {
                fill:      { patternType: "solid", fgColor: { rgb: "D4E6F1" } },
                font:      { bold: true, sz: 10, color: { rgb: "1A5276" } },
                alignment: col === 'G' ? center : left,
                border:    borderDark
            };
        });

        XLSX.utils.book_append_sheet(wb, wsPaid, '✅ Transaction Paid');
    }

    /* ════════════════════════════════════════════════
       SHEET 3 — TRANSACTION DELETED
    ════════════════════════════════════════════════ */
    if (delFiltered.length) {
        const delAOA = [
            ['No','Invoice ID','Table','Date / Time','Amount (USD)','Status'],
            ...delFiltered.map((o, i) => [
                i + 1,
                fid(o.invoiceID),
                o.table || '-',
                fdt(o.time),
                parseFloat(o.totalUSD || 0).toFixed(2),
                'Cancelled'
            ])
        ];

        const wsDel = XLSX.utils.aoa_to_sheet(delAOA);
        wsDel['!cols'] = [{wch:5},{wch:16},{wch:12},{wch:23},{wch:14},{wch:12}];
        wsDel['!rows'] = [{ hpt: 30 }];

        // Header
        ['A','B','C','D','E','F'].forEach(col => {
            const cell = wsDel[col + '1'];
            if (cell) cell.s = {
                fill:      { patternType: "solid", fgColor: { rgb: "922B21" } },
                font:      { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
                alignment: center,
                border:    borderDark
            };
        });

        // Zebra data rows
        delFiltered.forEach((_, i) => {
            const row = i + 2;
            const bg  = i % 2 === 0 ? "FFFFFF" : "FDEDEC";
            ['A','B','C','D','E','F'].forEach(col => {
                const cell = wsDel[col + row];
                if (cell) cell.s = {
                    fill:      { patternType: "solid", fgColor: { rgb: bg } },
                    font:      { sz: 10 },
                    alignment: col === 'D' ? left : center,
                    border:    borderThin
                };
            });
        });

        // Total row
        const totalRow = delFiltered.length + 2;
        const totalAmt = delFiltered.reduce((s, o) => s + parseFloat(o.totalUSD || 0), 0);
        XLSX.utils.sheet_add_aoa(wsDel,
            [['', '', '', 'TOTAL', '$' + totalAmt.toFixed(2), '']],
            { origin: `A${totalRow}` }
        );
        ['A','B','C','D','E','F'].forEach(col => {
            const cell = wsDel[col + totalRow];
            if (!cell) return;
            cell.s = {
                fill:      { patternType: "solid", fgColor: { rgb: "FADBD8" } },
                font:      { bold: true, sz: 10, color: { rgb: "922B21" } },
                alignment: center,
                border:    borderDark
            };
        });

        XLSX.utils.book_append_sheet(wb, wsDel, '🗑 Transaction Deleted');
    }

    // ── Save file ────────────────────────────────────
    const filename = `Khamo Coffee_${sd || 'all'}_${st.replace(':','')}__${ed || 'today'}_${et.replace(':','')}.xlsx`;
    XLSX.writeFile(wb, filename);
}

/* ══════════════════════════════════════════════════
   SEARCH
══════════════════════════════════════════════════ */
function filt(tbId, q) {
    q = q.toLowerCase().trim();
    document.querySelectorAll(`#${tbId} tr[data-q]`).forEach(r => {
        r.style.display = (r.dataset.q + r.innerText.toLowerCase()).includes(q) ? '' : 'none';
    });
}

/* ══════════════════════════════════════════════════
   PAGE SWITCH
══════════════════════════════════════════════════ */
function show(name) {
    ['paid', 'deleted', 'export'].forEach(p => {
        document.getElementById('pg-' + p).classList.toggle('show', p === name);
        const nb = document.getElementById('nb-' + p);
        nb.classList.remove('on', 'on-r');
        if (p === name) nb.classList.add(name === 'deleted' ? 'on-r' : 'on');
    });
}

/* ══════════════════════════════════════════════════
   INIT  —  cards start at zero, no auto-fetch
══════════════════════════════════════════════════ */
rPaid();
rDel();

// Set default dates but DO NOT trigger rp() — cards stay at $0.00
const _t = new Date();
const _p = v => String(v).padStart(2, '0');
const todayVal = `${_t.getFullYear()}-${_p(_t.getMonth()+1)}-${_p(_t.getDate())}`;

document.getElementById('ds').value = todayVal;
document.getElementById('de').value = todayVal;
document.getElementById('ts').value = "00:00";
document.getElementById('te').value = "23:59";

// Cards start at zero — seller must interact to populate
resetExportCards();