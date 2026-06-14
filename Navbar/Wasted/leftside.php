<?php
$backarrow = '/Point of Sale/POS_SYSTEM/img/arrow_back_ios_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png';


?>
<!-- <a href="../NegAdj.html">
    <img src="<?php echo $backarrow?>" alt="backarrow">
</a> -->

<div class="WastedProduct-list scroll_list" style="height: 300px;">
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Reason</th>
                <th></th>
            </tr>
        </thead>
        <tbody id="item-wasted"></tbody>
    </table>
 
</div>
<?php include 'SubmitBox.php' ?>

<!-- <select name="choose Reason" id="reason">
                        <option value="1">Customer Cancel</option>
                        <option value="2">Wrong Order/Recipe</option>
                        <option value="3">Product has been Spilled/Spoiled</option>
                        <option value="4">Out of Date</option>
                        <option value="5">Other</option>
                    </select> -->
