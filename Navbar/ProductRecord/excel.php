<?php
include "db.php";

$start = $_GET['start'];
$end = $_GET['end'];

// convert format (YYYY-MM-DD → DD-MM-YYYY)
$startFormatted = date("d-m-Y", strtotime($start));
$endFormatted = date("d-m-Y", strtotime($end));

$filename = $startFormatted . "To" . $endFormatted . ".xls";

header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=\"$filename\"");
header("Pragma: no-cache");
header("Expires: 0");

$sql = "
    SELECT 
        product_name,
        SUM(qty) AS total_qty,
        SUM(total) AS total_revenue,
        (
            SELECT category
            FROM Products
            WHERE Products.name = invoice_items.product_name
            LIMIT 1
        ) AS category
    FROM invoice_items
    WHERE DATE(created_at) BETWEEN ? AND ?
    GROUP BY product_name
    ORDER BY total_qty DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $start, $end);
$stmt->execute();

$result = $stmt->get_result();

echo "Product Name\tTotal Qty\tTotal Revenue\tCategory\n";

while ($row = $result->fetch_assoc()) {
    echo $row['product_name'] . "\t" .
        $row['total_qty'] . "\t" .
        $row['total_revenue'] . "\t" .
        $row['category'] . "\n";
}
?>