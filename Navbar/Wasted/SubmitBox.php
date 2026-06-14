<?php 
include 'connectionToDatabase.php';

if (isset($_POST['submit'])) {
    $product_id = $_POST['product_id'];
    $product_name = $_POST['product_name'];
    $product_unit = $_POST['product_unit'];
    $price = $_POST['price'];
    $category = $_POST['category'];
    $quantity = $_POST['quantity'];
    $reason = $_POST['reason'];
    $addToDatabase = 'INSERT INTO wasted_products (product_id, product_name, product_unit, price, category, quantity, reason) VALUES (?,?,?,?,?,?,?)';

    $stmt = $conn->prepare($addToDatabase);

    $stmt->bind_param("ssssss", $product_id, $product_name, $product_unit, $price, $category, $quantity, $reason);
    $stmt->execute();
    $stmt->close();
}

?>




<div class="submit">
<div id="submitSummary" style="padding: 10px;">
    <h3>Summary</h3>
    <p style="font-size: 10px; margin: 15px 0;">
        <strong>Total Products: <span id="totalProducts">0</span></strong>
    </p>
    
    <p style="font-size: 8px; margin-top: 20px; margin-bottom: 10px;">
        <strong>Type Of Products:</strong>
    </p>
    <div id="typeofproduct" style="margin-left: 20px; line-height: 1.8;font-size: 8px;">
        <!-- Product types will be populated here -->
    </div>
    
    <button id="submitBtn" style=" padding: 10px 30px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 10px;" type="submit" name="submit">
        Submit
    </button>
</div>
</div>
<script>
// Function to update the summary display
function updateSummary() {
    const wasted = JSON.parse(localStorage.getItem('wastedProducts') || '[]');
    
    if (wasted.length === 0) {
        document.getElementById('totalProducts').textContent = '0';
        document.getElementById('typeofproduct').innerHTML = '<p style="color: #999;">No products selected</p>';
        return;
    }
    
    // Count total products by quantity
    let totalQty = 0;
    let typeCount = {};
    
    wasted.forEach(product => {
        const qty = parseInt(product.qty) || 1;
        totalQty += qty;
        
        // Get the category from the product (assuming it has a category field)
        // If not, we can get it from the product data
        const category = product.category || 'Uncategorized';
        
        if (!typeCount[category]) {
            typeCount[category] = 0;
        }
        typeCount[category] += qty;
    });
    
    // Update total products
    document.getElementById('totalProducts').textContent = totalQty;
    
    // Build the type of products display
    let typeHtml = '';
    Object.keys(typeCount).forEach(type => {
        const count = typeCount[type];
        typeHtml += `<p style="margin: 5px 0;"><strong>${type}</strong> <span style="float: right;">${count}</span></p>`;
    });
    
    document.getElementById('typeofproduct').innerHTML = typeHtml;
}

// Function to submit the wasted products
function submitWastedProducts() {
    const wasted = JSON.parse(localStorage.getItem('wastedProducts') || '[]');
    
    if (wasted.length === 0) {
        alert('Please select at least one product');
        return;
    }
    
    // Send to server
    fetch('http://localhost:3000/api/save-wasted', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: wasted })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Wasted products saved successfully!');
            localStorage.removeItem('wastedProducts');
            updateSummary();
            // Optionally redirect or refresh
            location.reload();
        } else {
            alert('Error saving wasted products: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving wasted products');
    });
}

// Add click handler to submit button
document.getElementById('submitBtn').addEventListener('click', submitWastedProducts);

// Update summary on page load
document.addEventListener('DOMContentLoaded', updateSummary);

// Also update when products are added/removed (you can call this from other scripts)
window.updateWastedSummary = updateSummary;

//download wasted products as excel file


</script>