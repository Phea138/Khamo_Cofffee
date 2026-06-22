document.getElementById("filter").addEventListener("click", function () {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;

    fetch("fetchProduct.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ start, end })
    })
    .then(res => res.json())
    .then(data => {
        let html = `
            <table border="1" cellpadding="8">
                <tr>
                    <th>Product</th>
                    <th>Total Qty</th>
                    <th>Total Revenue</th>
                    <th>Category</th>
                </tr>
        `;

        data.forEach(row => {
            html += `
                <tr>
                    <td>${row.product_name}</td>
                    <td>${row.total_qty}</td>
                    <td>${row.total_revenue}</td>
                    <td>${row.category}</td>
                </tr>
            `;
        });

        html += "</table>";
        if (data.length === 0) {
            document.getElementById("result").innerHTML = "<p>No products found.</p>";
        } else {
            document.getElementById("result").innerHTML = html;
        }
    });
});

document.getElementById("export").addEventListener("click", function () {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;

    window.location.href = "excel.php?start=" + start + "&end=" + end;
});