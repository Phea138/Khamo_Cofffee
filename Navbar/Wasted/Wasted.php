<?php
$backarrow = '/Khamo POS/POS_SYSTEM/img/arrow_back_ios_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php include 'header.php' ?>
</head>
<body>
<div class="wastedWrapper">
    <div class="backButton"><a href="/Khamo POS/POS_SYSTEM/Navbar/TrackingProduct.html">
        <img src="<?php echo $backarrow; ?>" alt="Back">
    </a></div>

    <div class="wastedBody">
        <div class="sidebar">
                 <?php include 'leftside.php' ?>
        </div>
        <div class="rightside">
            <?php include 'WastedList.php'?>
        </div>
    </div>
</div>
</body>
</html>
