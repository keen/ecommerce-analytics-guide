window._VISIT_COOKIE = "_has_visited_site";
window._VISIT_COOKIE_DATE = "_has_visited_site_date";
window._events = [];

$(window).load(function() {
    var queryString = new QS();

    if (location.search && location.search.length && queryString.has('product-id')) {
        var product_id = queryString.get('product-id');
        $("#product-container").attr('data-product-id', product_id);
    }

    setProducts();
    setInterval(showEvents, 1000);


});

window._addEvent = function(collection, event, callback, reason) {
    var eventData = event || {};

    eventData.user = {
        uuid: getFirstVisitCookie(),
        first_visited_at: getFirstVisitedDateCookie()
    };

    window._keenClient.addEvent(collection, eventData, callback);
    window._events.push({
        code: getEventCode(collection, eventData),
        reason: reason
    });
};

window._keenClient = new Keen({
    projectId: '5557fe1c2fd4b1326f14444e',
    writeKey: '500da5dd41d521713afc7e1b323f1d70f707fc9b4d9014b9911892a054c2849a9b1f2b2ab500c28fc8f03613cfc125b4c3a432d7f43e69acb8824d249d0cb65b6802d8a610bf1a7ab37d5d17bc27aa5617ca2a51742dedd735b65ca5fc4d62b1405c13f30b575375e171d44708b598c4',
    readKey: 'd6cc507cf72af7dd0746b630edc51179355e2c074ab46d4545d3bfcecb02dabcbc46a78b8df5dd4b4b6ba2a7dff8fd5b3e3adbdf05cfeb42538205d2b528a357b0ab010e8c7efab939a01bce5be678a5dc3a7fa949db33cbee815a00dca93848d0b96908269a8be2bf70e40a9e213fb0'
});


window._getCartId = function() {
    if (localStorage.cart_id && localStorage.cart_id.length)
        return localStorage.cart_id;

    localStorage.cart_id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

    return localStorage.cart_id;
};

window._getCart = function() {
    if (localStorage.cart_items && localStorage.cart_items.length)
        return JSON.parse(localStorage.cart_items);

    return [];
};

window._setCart = function(cart) {
    localStorage.cart_items = JSON.stringify(cart);
};

window._addToCart = function(product) {
    var cartItems = window._getCart();
    cartItems.push(product.id);
    window._setCart(cartItems);

    var addToCartEvent = {
        "cart_id": window._getCartId(),
        "product_id": product.id,
        "product_name": product.title,
        "product_price": product.price,
        "quantity": 1
    }
    window._addEvent("add_to_carts", addToCartEvent, function(err, res) {

    }, "User clicked the Add to Cart button.");
};

window._products_list = [
    {
        "id": 1,
        "title": "Be grateful, for everything.",
        "image": "https://behapy.s3.amazonaws.com/76/34/597634/default.jpg",
        "price": 49.99
    },
    {
        "id": 2,
        "title": "Joy is the simplest form of gratitude.",
        "image": "https://behapy.s3.amazonaws.com/76/30/597630/default.jpg",
        "price": 49.99
    },
    {
        "id": 3,
        "title": "Spend your life doing strange things with weird people",
        "image": "https://behapy.s3.amazonaws.com/74/36/597436/default.jpg",
        "price": 49.99
    },
    {
        "id": 4,
        "title": "People are as  happy  as they make their minds up to be",
        "image": "https://behapy.s3.amazonaws.com/72/11/597211/default.jpg",
        "price": 49.99
    },
    {
        "id": 5,
        "title": "Not all of us can do great things But we can do small things with great love",
        "image": "https://behapy.s3.amazonaws.com/70/79/597079/default.jpg",
        "price": 49.99
    },
    {
        "id": 6,
        "title": "A pessimist sleeps with a knife under his pillow",
        "image": "https://behapy.s3.amazonaws.com/61/65/596165/default.jpg",
        "price": 49.99
    },
    {
        "id": 7,
        "title": "Everything you want is out there waiting for you to ask",
        "image": "https://behapy.s3.amazonaws.com/61/42/596142/default.jpg",
        "price": 49.99
    },
    {
        "id": 8,
        "title": "Kind words can be short",
        "image": "https://behapy.s3.amazonaws.com/27/99/592799/default.jpg",
        "price": 49.99
    },
    {
        "id": 9,
        "title": "Be who you are",
        "image": "https://behapy.s3.amazonaws.com/39/40/593940/default.jpg",
        "price": 49.99
    }
];

function setProducts() {
    _.each(window._products_list, function(product) {
        var $container = $("[data-product-id=" + product.id + "]");

        $container.find("[data-product-title]").html(product.title);
        $container.find("[data-product-price]").html(product.price);

        var image = document.createElement("img");
        image.src = product.image;

        $container.find("[data-product-image]").html(image);
    });
}

var oldEventsLength = 0;

function showEvents() {
    if (!window._events || (window._events && !window._events.length)) {
        $('body').removeClass('visible-events-list');
        return;
    }

    if (oldEventsLength === window._events.length)
        return;

    var $container = $('.events-list .events');
    var $code = $container.find("code");
    var text = "";

    _.each(window._events, function(event) {
        text += "// " + event.reason + "\n";
        text += event.code + "\n";
        // text += "\n";
    });

    $code.html(text);

    $('body').addClass('visible-events-list');

    if ($container && $container.length && oldEventsLength !== window._events.length) {
        $container.stop().animate({
            scrollTop: $container[0].scrollHeight
        }, 800);
    }

    oldEventsLength = window._events.length;

    if ($code && $code.length)
        hljs.highlightBlock($code.get(0));
}

function getEventCode(collection, event) {
    return "Keen.addEvent(\""+ collection + "\", " + JSON.stringify(event, null, 4) + ")";
}


function getFirstVisitCookie() {
    return Cookies.get(window._VISIT_COOKIE);
}

function getFirstVisitedDateCookie() {
    var value = Cookies.get(window._VISIT_COOKIE_DATE);

    if (value)
        return new Date(value);

    return null;
}
