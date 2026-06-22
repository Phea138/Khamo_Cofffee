 /* ══ MANAGER PASSWORD ══ */
        const modal = document.getElementById('managerModal');
        let pwd = "";
        const MAX_DIGITS = 6;
        const VALID_PASSWORDS = ["1234", "4321", "0000"];

        modal.addEventListener('click', function (e) {
            if (e.target.classList.contains('num-btn') && !e.target.classList.contains('del-btn')) appendDigit(e.target.dataset.val);
            if (e.target.classList.contains('del-btn') || e.target.closest('.del-btn')) deleteDigit();
            if (e.target.id === 'loginConfirm' || e.target.closest('#loginConfirm')) confirmPassword();
            if (e.target.id === 'loginCancel'  || e.target.closest('#loginCancel'))  closeManagerModal();
        });

        function openManagerModal() {
            pwd = ""; updateDots();
            document.getElementById('pwdDisplay').classList.remove('error','shake');
            modal.style.display = "flex";
        }
        function closeManagerModal() { modal.style.display = "none"; pwd = ""; updateDots(); }
        function appendDigit(val)    { if (pwd.length >= MAX_DIGITS) return; pwd += val; updateDots(); }
        function deleteDigit()       { pwd = pwd.slice(0,-1); updateDots(); document.getElementById('pwdDisplay').classList.remove('error','shake'); }
        function updateDots()        { document.querySelectorAll('.pwd-dot').forEach((d,i) => d.classList.toggle('filled', i < pwd.length)); }

        function confirmPassword() {
            if (VALID_PASSWORDS.includes(pwd)) { 
                closeManagerModal();
                showSettingPage(2); 
            
            }else {
                const disp = document.getElementById('pwdDisplay');
                disp.classList.add('error','shake');
                pwd = ""; updateDots();
                setTimeout(() => disp.classList.remove('error','shake'), 500);
            }
        }


        function showSettingPage(n) {
            document.getElementById("settingPage1").style.display = n === 1 ? "" : "none";
            document.getElementById("settingPage2").style.display = n === 2 ? "" : "none";
        }
        function backToSettingPage1()   { 
            showSettingPage(1); 
        }

        function goToTransactionRecord(){ 
            window.location.href = "/Khamo POS/POS_SYSTEM/StransactionRecord/stransaction.html"; 
        }
        


async function handleReturnPayment() {
    /* ── Get invoiceID from URL ?view= param ── */
    const params    = new URLSearchParams(window.location.search);
    const viewID    = params.get("view");

    if (!viewID) {
        alert("Please open a paid invoice first from Transaction Record.");
        return;
    }

    returnInvoiceData = null;
    document.getElementById('returnInfoBox').style.display     = 'none';
    document.getElementById('returnConfirmBtn').style.display  = 'none';
    document.getElementById('returnSearchError').style.display = 'none';
    document.getElementById('returnListBox').innerHTML         = '';
    document.getElementById('returnModal').style.display       = 'flex';

    try {
        const res  = await fetch(`http://localhost:3000/api/invoice-detail/${viewID}`);
        const data = await res.json();

        if (!data || data.error) {
            document.getElementById('returnSearchError').textContent   = 'Invoice not found.';
            document.getElementById('returnSearchError').style.display = 'block';
            return;
        }
        if (data.status === 'RETURNED') {
            document.getElementById('returnSearchError').textContent   = 'This invoice has already been returned.';
            document.getElementById('returnSearchError').style.display = 'block';
            return;
        }
        if (data.status === 'DELETED') {
            document.getElementById('returnSearchError').textContent   = 'This invoice was deleted and cannot be returned.';
            document.getElementById('returnSearchError').style.display = 'block';
            return;
        }

        returnInvoiceData = data;

        document.getElementById('retInvoiceID').textContent = data.invoiceID || viewID;
        document.getElementById('retTable').textContent     = data.tableName || data.table || '-';
        document.getElementById('retTotal').textContent     = '$' + parseFloat(data.totalUSD || 0).toFixed(2);
        document.getElementById('retPayment').textContent   = data.paymentMethod || 'Cash';
        document.getElementById('retPayment').style.color   =
            (data.paymentMethod || '').toLowerCase().includes('aba') ? '#e67e22' : '#c0392b';

        document.getElementById('returnInfoBox').style.display    = 'block';
        document.getElementById('returnConfirmBtn').style.display = 'inline-block';

    } catch (e) {
        console.error(e);
        document.getElementById('returnSearchError').textContent   = 'Server error. Check console.';
        document.getElementById('returnSearchError').style.display = 'block';
    }
}

async function selectReturnInvoice(invoiceID) {
    const err = document.getElementById('returnSearchError');
    err.style.display = 'none';

    try {
        const res  = await fetch(`http://localhost:3000/api/invoice-detail/${invoiceID}`);
        const data = await res.json();

        if (!data || data.error) {
            err.textContent = 'Invoice not found.';
            err.style.display = 'block';
            return;
        }

        returnInvoiceData = data;

        document.getElementById('retInvoiceID').textContent = data.invoiceID || invoiceID;
        document.getElementById('retTable').textContent     = data.tableName || data.table || '-';
        document.getElementById('retTotal').textContent     = '$' + parseFloat(data.totalUSD || 0).toFixed(2);
        document.getElementById('retPayment').textContent   = data.paymentMethod || 'Cash';
        document.getElementById('retPayment').style.color   =
            (data.paymentMethod || '').toLowerCase().includes('aba') ? '#e67e22' : '#c0392b';

        document.getElementById('returnListBox').style.display    = 'none';
        document.getElementById('returnInfoBox').style.display    = 'block';
        document.getElementById('returnConfirmBtn').style.display = 'inline-block';

    } catch (e) {
        console.error(e);
        err.textContent = 'Server error. Check console.';
        err.style.display = 'block';
    }
}



async function confirmReturn() {
    if (!returnInvoiceData) return;
    const invoiceID = returnInvoiceData.invoiceID;

    try {
        const res  = await fetch('http://localhost:3000/api/return-invoice', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ invoiceID })
        });
        const data = await res.json();

        if (!data.success) { alert('Return failed. Check server.'); return; }

        // send Telegram
        await fetch('http://localhost:3000/api/send-return-telegram', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ invoice: returnInvoiceData })
        });

        document.getElementById('returnModal').style.display = 'none';
        returnInvoiceData = null;

        // go back to transaction record after return
        showShiftToast(`↩️ Invoice ${invoiceID} returned successfully.`);
        setTimeout(() => {
            window.location.href = "/Khamo POS/POS_SYSTEM/StransactionRecord/stransaction.html";
        }, 1500);

    } catch (e) {
        console.error(e);
        alert('Server error. Check console.');
    }
}

function closeReturnModal() {
    document.getElementById('returnModal').style.display = 'none';
    document.getElementById('returnListBox').style.display = 'block';
    returnInvoiceData = null;
}

        /* ══ CLOSE SHIFT ══ */
        function openCloseShiftConfirm() { 
            document.getElementById("closeShiftModal").classList.add("active"); 
        }
        function cancelCloseShift() { 
            document.getElementById("closeShiftModal").classList.remove("active");
         }

        async function confirmCloseShift() {
    document.getElementById("closeShiftModal").classList.remove("active");
    try {
        const res  = await fetch("http://localhost:3000/api/close-shift", { method: "POST", headers: { "Content-Type": "application/json" } });
        const data = await res.json();
        if (data.success) {
            showShiftToast(`✅ Shift closed — ${data.closed} transactions archived.`);
            setTimeout(() => {
                window.location.href = "/Khamo POS/POS_SYSTEM/index.html";
            // }, 1500); 1500 for wait to move index.html
            },);
        } else {
            alert("Close shift failed. Check server.");
        }
      } catch (err) { console.error(err); alert("Server error. Check console."); }
  }

        function showShiftToast(msg) {
            const t = document.getElementById("shiftToast");
            t.textContent = msg; t.classList.add("show");
            setTimeout(() => t.classList.remove("show"), 3500);
        }

        document.getElementById("closeShiftModal").addEventListener("click", function(e) {
            if (e.target === this) cancelCloseShift();
        });

        /* ══ SETTING PAGE 1 ══ */
        function handleComment() {
            const selected = document.querySelector(".selected-row");
            if (!selected) { alert("Please select an item first!"); return; }
            document.getElementById("commentModal").style.display = "flex";
        }

        function handlePromoCode()  { alert("Coming soon"); }
        function handleStaffClaim() { alert("Coming soon"); }

        /* ══ KEYBOARD iframe messages ══ */
        window.addEventListener("message", function(e) {
            if (e.data && e.data.type === "CLOSE_COMMENT") {
                document.getElementById("commentModal").style.display = "none";
            }
        });