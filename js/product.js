function addToCart(e) {
    e.preventDefault();

    var queryString = new QS();
    var productId = parseInt(queryString.get('product-id'), 10);
    var product = _.findWhere(window._products_list, {id: productId});

    window._addToCart(product);
}

function isCheckoutReady() {
    var cart = window._getCart();
    var $cartBtn = $("#product-container .cart");
    if (cart && cart.length) {
        $cartBtn.html("Checkout (" + cart.length + ")");
        $cartBtn.show();
    }
}

$(document).ready(function() {
    $("#product-container .add-to-cart").click(addToCart);
    $("#product-container .cart").hide();

    setInterval(isCheckoutReady, 800);
});

$(window).load(function() {
    var queryString = new QS();
    var productId = parseInt(queryString.get('product-id'), 10);
    var product = _.findWhere(window._products_list, {id: productId});

    var productViewEvent = {
        "path": location.pathname + location.search,
        "product_id": product.id,
        "product_name": product.title,
        "product_price": product.price
    };

    window._addEvent("product_views", productViewEvent, function(err, res) {

    }, "Viewed product page.");
});