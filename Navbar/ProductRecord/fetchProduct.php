<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$start = $data['start'];
$end = $data['end'];

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

$output = [];

while ($row = $result->fetch_assoc()) {
    $output[] = $row;
}

echo json_encode($output);
?>