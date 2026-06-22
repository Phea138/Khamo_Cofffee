<?php
$backarrow = '/POS_SYSTEM/img/arrow_back_ios_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <?php include 'headerProduct.php'; ?>
</head>
<body>
    <div class="backButton"><a href="/Khamo POS/POS_SYSTEM/Navbar/TrackingProduct.html">
        <img src="<?php echo $backarrow; ?>" alt="Back">
    </a></div>
<div class="contener">

    <div class="selectdate">
        <label>Start date:</label>
        <input type="date" id="start">

        <label>End date:</label>
        <input type="date" id="end">

        <button id="filter">Filter</button>
        <button id="export">Export Excel</button>
    </div>

    <br>
  

</div>

  <div id="result"></div>

<script src="ProductRecordScript.js"></script>
</body>
</html>