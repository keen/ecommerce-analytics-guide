var redirecting = false;
var showCartInterval;

$(document).ready(function() {
    showCartInterval = setInterval(showCart, 1000);

    $(".success-area").hide();
    $(".purchase-area a").click(makePurchase);
});


function showSuccess() {
    $(".purchase-area").hide();
    $(".success-area").show();
}

function makePurchase(e) {
    clearInterval(showCartInterval);

    e.preventDefault();
    redirecting = true;

    var cartItems = window._getCart();
    window._setCart([]);

    var purchaseEvent = {
        cart_id: window._getCartId(),
        total: getTotal(cartItems)
    };

    window._addEvent("purchases", purchaseEvent, function(err, res) {}, "Completed purchase.");
    showSuccess();
}

function getTotal(cartItems) {
    var quantities = _.countBy(cartItems);
    var totalSum = 0;

    _.each(_.keys(quantities), function(productId) {
        var product = getProduct(productId);

        totalSum += product.price * quantities[productId];
    });

    return totalSum;
}

function showCart() {
    var cartItems = window._getCart();

    if (!cartItems || (cartItems && !cartItems.length))
        return goToIndex();

    var $items = $("#cart tbody");
    var $total = $("#total");

    $items.children().remove();

    var totalSum = 0;
    var quantities = _.countBy(cartItems);

    _.each(_.keys(quantities), function(productId) {
        var product = getProduct(productId);

        if (!product)
            return;

        var name = document.createElement('td');
        var quantity = document.createElement('td');
        var price = document.createElement('td');

        name.innerHTML = product.title;
        quantity.innerHTML = quantities[productId];
        price.innerHTML = "$" + product.price;

        var item = document.createElement('tr');
        item.appendChild(name);
        item.appendChild(quantity);
        item.appendChild(price);

        $items.append(item);
        totalSum += product.price * quantities[productId];
    });

    $total.html("$" + totalSum);
}

function getProduct(productId) {
    return _.findWhere(window._products_list, {id: parseInt(productId)});
}

function goToIndex() {
    if(!redirecting && !alert("You have to first add products to your Cart!")) {
        redirecting = true;
        window.location = "index.html"
    }
}