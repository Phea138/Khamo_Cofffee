<?php
include_once('connectionToDatabase.php');

// Always fetch all products (filtering happens on frontend)
$sql = "SELECT * FROM products ORDER BY category, product_name";

$result = mysqli_query($conn, $sql);
?>


<div class="container">

<h2>Search Product</h2>

<form onsubmit="performSearch(event)">
<div class="searchProduct">
    <input type="text" id="searchInput" name="search" placeholder="Search product..." value="">
    <button type="submit">Search</button>
</div>
</form>

<div class="scroll_list">
    <table id="productsTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Category</th>
            </tr>
        </thead>
        <tbody id="productsTableBody">
            <?php while($row=$result->fetch_assoc()){ ?>
            <tr class="select-product" 
                data-id="<?php echo $row['product_id']; ?>" 
                data-name="<?php echo $row['product_name']; ?>" 
                data-unit="<?php echo $row['product_unit']; ?>" 
                data-price="<?php echo $row['price']; ?>" 
                data-category="<?php echo $row['category']; ?>">
                <td><?php echo $row['product_id'] ?></td>
                <td><?php echo $row['product_name'] ?></td>
                <td><?php echo $row['product_unit'] ?></td>
                <td><?php echo $row['price'] ?></td>
                <td><?php echo $row['category'] ?></td>
            </tr>
            <?php } ?>
        </tbody>
    </table>
</div>
</div>
<script>
// Function to add product to localStorage
function addProductToLeft(product){
    // Get current wasted products
    let wasted = JSON.parse(localStorage.getItem('wastedProducts') || '[]');

    // Check for duplicates
    if(wasted.some(p => p.id === product.id)){
        alert('Product already selected!');
        return;
    }

    wasted.push(product);
    localStorage.setItem('wastedProducts', JSON.stringify(wasted));

    renderLeftSide();
    
    // Update summary display if function exists
    if (typeof window.updateWastedSummary !== 'undefined') {
        window.updateWastedSummary();
    }
}

// Render leftside table
function renderLeftSide(){
    const tbody = document.getElementById('item-wasted');
    tbody.innerHTML = '';

    let wasted = JSON.parse(localStorage.getItem('wastedProducts') || '[]');

    wasted.forEach((product, index) => {
        const tr = document.createElement('tr');
        tr.dataset.id = product.id;
        tr.innerHTML = `
            <td name="product_id">${product.id}</td>
            <td name="product_name">${product.name}</td>
            <td name="product_quantity"><input type="number" value="${product.qty}" min="1" style="width:60px;" data-index="${index}" class="qty-input"></td>
            <td name="product_unit">${product.unit}</td>
            <td name="product_price">${product.price}</td>
            <td name="product_reason"><input type="text" placeholder="Reason" value="${product.reason}" data-index="${index}" class="reason-input"></td>
            <td><img src="/Point of Sale/POS_SYSTEM/img/delete_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png" onclick="deleteItem(this)" style="cursor:pointer; width:20px;"></td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listeners to save changes
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('input', function() {
            const index = this.dataset.index;
            let wasted = JSON.parse(localStorage.getItem('wastedProducts') || '[]');
            wasted[index].qty = this.value;
            localStorage.setItem('wastedProducts', JSON.stringify(wasted));
            
            // Update summary display if function exists
            if (typeof window.updateWastedSummary !== 'undefined') {
                window.updateWastedSummary();
            }
        });
    });

    document.querySelectorAll('.reason-input').forEach(input => {
        input.addEventListener('input', function() {
            const index = this.dataset.index;
            let wasted = JSON.parse(localStorage.getItem('wastedProducts') || '[]');
            wasted[index].reason = this.value;
            localStorage.setItem('wastedProducts', JSON.stringify(wasted));
        });
    });
}

// Click handler - attach to all select-product rows
function attachProductClickHandlers() {
    document.querySelectorAll('.select-product').forEach(row => {
        row.removeEventListener('click', handleProductClick);
        row.addEventListener('click', handleProductClick);
    });
}

function handleProductClick(event) {
    event.preventDefault();
    const product = {
        id: this.dataset.id,
        name: this.dataset.name,
        unit: this.dataset.unit,
        price: this.dataset.price,
        category: this.dataset.category,
        qty: 1,
        reason: ''
    };
    addProductToLeft(product);
}

function deleteItem(img){
    const row = img.closest("tr");
    const id = row.dataset.id;

    // Remove from UI
    row.remove();

    // Remove from localStorage
    let wasted = JSON.parse(localStorage.getItem('wastedProducts') || '[]');
    wasted = wasted.filter(item => item.id !== id);
    localStorage.setItem('wastedProducts', JSON.stringify(wasted));
    
    // Update summary display if function exists
    if (typeof window.updateWastedSummary !== 'undefined') {
        window.updateWastedSummary();
    }
}
// Initial render (on page load)
renderLeftSide();

// Update summary on initial load
if (typeof window.updateWastedSummary !== 'undefined') {
    window.updateWastedSummary();
}

// Clear localStorage when leaving the page
window.addEventListener('beforeunload', function() {
    localStorage.removeItem('wastedProducts');
});

// Search function - prevents page refresh and filters products
function performSearch(event) {
    event.preventDefault();
    
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#productsTableBody tr.select-product');
    
    if (searchValue === '') {
        // Show all rows
        rows.forEach(row => {
            row.style.display = '';
        });
    } else {
        rows.forEach(row => {
            const id = row.dataset.id.toLowerCase();
            const name = row.dataset.name.toLowerCase();
            const category = row.dataset.category.toLowerCase();
            
            // Show row if search matches any field
            if (id.includes(searchValue) || name.includes(searchValue) || category.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

// Real-time search as user types
document.getElementById('searchInput').addEventListener('input', function() {
    performSearch({ preventDefault: () => {} });
});

// Attach click handlers to all product rows on page load
document.addEventListener('DOMContentLoaded', function() {
    attachProductClickHandlers();
});

// Initial attach
attachProductClickHandlers();
</script>
