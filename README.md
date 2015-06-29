# E-Commerce Tracking Guide

This guide will walk you through some best practices for using Keen IO to track common e-commerce metrics such as:

- Sign Up Rate
- Activation Rate / Conversion Rate
- Add to Cart Rate
- Average Order Value
- Repeat Purchase Rate
- Lifetime Value

## Data Model

In order to be able to do the queries for the metrics, we'll have to have the right data collections in place. Below, you'll find an example data model to use for your shop.

### Collections

We'll be using the following collections that will help us

#### Collection: first_visits
**Purpose:** To track the first visit of each visitor.
**Attributes:**

- `path`: Path of the page.
- `referrer`: Referrer URL, taken from `document.referrer`.
- `params`: Desired URL params.
- `user`: Information about the user, [explained here](#common-attributes).

Example event:

```javascript
var client = new Keen({
    projectId: "your_project_id",
    writeKey: "your_write_key"
});

client.addEvent('first_visits', {
    path: "/ad-landing-page",
    referrer: "http://google.com",
    params: {
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "campaign_name"
    },
    "user": {
        uuid: "xxxx-xxxx-xxxx-xxxx-xxxx",
        first_visited_at: "2015-06-29T07:36:55.929Z"
    }
});
```


#### Collection: product_views
**Purpose:** To track product page views.
**Attributes:**

- `path`: Path of the page.
- `product_id`: Product's ID.
- `product_name`: Product's Name.
- `product_price`: Product's Price.
- `user`: Information about the user, [explained here](#common-attributes).

Example event:

```javascript
var client = new Keen({
    projectId: "your_project_id",
    writeKey: "your_write_key"
});

client.addEvent('product_views', {
    "path": "/products/1800-summer-pants",
    "product_id": "1800"",
    "product_name": "Summer Pants",
    "product_price": 69.99,
    "user": {
        uuid: "xxxx-xxxx-xxxx-xxxx-xxxx",
        first_visited_at: "2015-06-29T07:36:55.929Z"
    }
});
```

#### Collection: add_to_carts
**Purpose:** To track a user adding a product to their Cart.
**Attributes:**

- `cart_id`: Cart'd ID.
- `product_id`: Product's ID.
- `product_name`: Product's Name.
- `product_price`: Product's Price.
- `quantity`: Quantity being added to Cart.
- `user`: Information about the user, [explained here](#common-attributes).

Example event:

```javascript
var client = new Keen({
    projectId: "your_project_id",
    writeKey: "your_write_key"
});

client.addEvent('add_to_carts', {
    "cart_id": "201",
    "product_id": "1800",
    "product_name": "Summer Pants",
    "product_price": 69.99,
    "quantity": 1,
    "user": {
        uuid: "xxxx-xxxx-xxxx-xxxx-xxxx",
        first_visited_at: "2015-06-29T07:36:55.929Z"
    }
});
```

#### Collection: purchases
**Purpose:** To track a succesful purchase.
***Attributes:***

- `cart_id`: Cart being purchased's ID.
- `total`: Total amount being purchased.
- `user`: Information about the user, [explained here](#common-attributes).

Example event:

```javascript
var client = new Keen({
    projectId: "your_project_id",
    writeKey: "your_write_key"
});

client.addEvent('purchases', {
    "cart_id": "201",
    "total": 139.98,
    "user": {
        uuid: "xxxx-xxxx-xxxx-xxxx-xxxx",
        first_visited_at: "2015-06-29T07:36:55.929Z"
    }
});
```

### Common attributes

In order to connect the different collections, we will be sending a user object attributes with all our events:

- `user.uuid`: An identifier generated for the user when they first visited.
- `user.first_visited_at`: A date for when the user first visited.

The common `user` attribute will help us to follow the user's journey through their experience on the site over time.


## Tracking & Visualization

### Tracking

To illustrate how to use the data model, we've created a [fake example e-commerce website here](http://nemo.github.io/keen-ecommerce-guide/) with detailed examples of how and when to send events during the user's experience with your shop.


### Visualization

Based on this data model and the events that are sent on the shop, we've setup an example dashboard [here](http://nemo.github.io/keen-ecommerce-guide/). You can also view the source for this dashboard in [dashboard.js](https://github.com/nemo/keen-ecommerce-guide/blob/master/js/dashboard.js) and [dashboard.html](https://github.com/nemo/keen-ecommerce-guide/blob/master/dashboard.html).
