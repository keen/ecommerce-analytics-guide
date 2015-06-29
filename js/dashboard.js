$(document).ready(function() {
        showPurchaseFunnel();
        showTotalRevenue();
        showDailyRevenue();
        showAOV();
        showAddToCartRate();
        showRepeatPurchaseRate();
        showConversionRate();
        showLifeTimeValue();
});

function showPurchaseFunnel() {
    var query = new Keen.Query("funnel", {
            steps: [
                    {
                        event_collection: 'first_visits',
                        actor_property: 'user.uuid'
                    },
                    {
                            event_collection: 'product_views',
                            actor_property: 'user.uuid'
                    },
                    {
                            event_collection: 'add_to_carts',
                            actor_property: 'user.uuid'
                    },
                    {
                        event_collection: 'purchases',
                        actor_property: 'user.uuid'
                    }
            ]
    });

    var chart = new Keen.Dataviz();

    chart
        .el(document.getElementById("funnel"))
        .library('c3')
        .chartType('bar')
        .height(200)
        .labels([
            "First Visit",
            "Viewed Product",
            "Added to Cart",
            "Purchased"
        ])
        .prepare();

    var req = window._keenClient.run(query, function(err, res){
        if (err) {
            chart.error(err.message);
        }
        else {
            chart
                .parseRequest(this)
                .title(" ")
                .render();
        }
    });

    setInterval(function(){
        chart.prepare(); // restart the spinner
        req.refresh();
    }, 60*1000);
}

function showLifeTimeValue() {
    var query = new Keen.Query("average", {
        event_collection: 'purchases',
        target_property: 'total',
        group_by: 'user.uuid'
    });

    var chart = new Keen.Dataviz();

    chart
        .el(document.getElementById("lifetime-value"))
        .chartType('metric')
        .height(200)
        .colors(["#fff"])
        .chartOptions({
            prefix: "$"
        })
        .prepare();

    var req = window._keenClient.run(query, function(err, res){
        if (err) {
            chart.error(err.message);
        }
        else {

            var total = _.reduce(res.result, function(total, obj) {
                return total + obj.result;
            }, 0);

            var average = total / _.pluck(res.result, 'user.uuid').length;

            chart
                .parseRawData({ result: average })
                .title(" ")
                .render();
        }
    });

    setInterval(function(){
        chart.prepare(); // restart the spinner
        req.refresh();
    }, 60*1000);
}

function showAddToCartRate() {
    var query = new Keen.Query("funnel", {
            steps: [
                    {
                            event_collection: 'product_views',
                            actor_property: 'user.uuid'
                    },
                    {
                            event_collection: 'add_to_carts',
                            actor_property: 'user.uuid'
                    }
            ]
    });

    var chart = new Keen.Dataviz();

    chart
        .el(document.getElementById("add-to-cart"))
        .chartType('metric')
        .height(200)
        .colors(["#fff"])
        .chartOptions({
            suffix: "%"
        })
        .prepare();

    var req = window._keenClient.run(query, function(err, res){
        if (err) {
            chart.error(err.message);
        }
        else {
            chart
                .parseRawData({ result: 100 * res.result[1]/res.result[0] })
                .title(" ")
                .render();
        }
    });

    setInterval(function(){
        chart.prepare(); // restart the spinner
        req.refresh();
    }, 60*1000);
}

function showTotalRevenue() {
    var query = new Keen.Query("sum", {
        event_collection: 'purchases',
        target_property: 'total'
    });

    var chart = new Keen.Dataviz();

    chart
        .el(document.getElementById("total-revenue"))
        .chartType('metric')
        .height(200)
        .colors(["#fff"])
        .chartOptions({
            prefix: "$"
        })
        .prepare();

    var req = window._keenClient.run(query, function(err, res){
        if (err) {
            chart.error(err.message);
        }
        else {
            chart
                .parseRequest(this)
                // .parseRawData({ result: res.result })
                .title(" ")
                .render();
        }
    });

    setInterval(function(){
        chart.prepare(); // restart the spinner
        req.refresh();
    }, 60*1000);
}

function showDailyRevenue() {
        var query = new Keen.Query("sum", {
                eventCollection: "purchases",
                timeframe: "this_30_days",
                target_property: 'total',
                interval: 'daily',
                maxAge: 300 // activate query caching by assigning maxAge (an integer representing seconds)
        });

        var chart = new Keen.Dataviz();

        chart
            .el(document.getElementById("chart-revenue"))
            .height(200)
            .library('c3')
            .chartType('line')
            .chartOptions({
                axis: {
                    y: {
                        tick: {
                            format: d3.format("$,.2f")
                        }
                    },
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d'
                        }
                    }
                },
                tooltip: {
                    format: {
                        value: d3.format('$,.2f')
                    }
                }
            })
            .prepare();

        var req = window._keenClient.run(query, function(err, res){
            if (err) {
                chart.error(err.message);
            }
            else {
                chart
                    .parseRequest(this)
                    .title(" ")
                    .render();
            }
        });

        setInterval(function(){
            chart.prepare(); // restart the spinner
            req.refresh();
        }, 60*1000);
}

function showAOV() {
        var query = new Keen.Query("average", {
                eventCollection: "purchases",
                timeframe: "this_30_days",
                target_property: 'total',
                interval: 'weekly',
                maxAge: 300 // activate query caching by assigning maxAge (an integer representing seconds)
        });

        var chart = new Keen.Dataviz();

        chart
            .el(document.getElementById("chart-aov"))
            .library('c3')
            .chartType('line')
            .labels(['AOV'])
            .chartOptions({
                axis: {
                    y: {
                        tick: {
                            format: d3.format("$,.2f")
                        }
                    },
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d'
                        }
                    }
                },
                tooltip: {
                    format: {
                        value: d3.format('$,.2f')
                    }
                }
            })
            .height(200)
            .prepare();

        var req = window._keenClient.run(query, function(err, res) {
            if (err) {
                chart.error(err.message);
            }
            else {
                chart
                    .parseRequest(this)
                    .title(" ")
                    .render();
            }
        });

        setInterval(function(){
            chart.prepare(); // restart the spinner
            req.refresh();
        }, 60*1000);
}

function showConversionRate() {
    var query = new Keen.Query("funnel", {
            steps: [
                    {
                            event_collection: 'first_visits',
                            actor_property: 'user.uuid'
                    },
                    {
                            event_collection: 'purchases',
                            actor_property: 'user.uuid'
                    }
            ]
    });

    var chart = new Keen.Dataviz();

    chart
        .el(document.getElementById("conversion-rate"))
        .chartType('metric')
        .colors(["#fff"])
        .height(200)
        .chartOptions({
            suffix: "%"
        })
        .prepare();

    var req = window._keenClient.run(query, function(err, res){
        if (err) {
            chart.error(err.message);
        }
        else {
            chart
                .parseRawData({ result: 100 * res.result[1]/res.result[0] })
                .title(" ")
                .render();
        }
    });

    setInterval(function(){
        chart.prepare(); // restart the spinner
        req.refresh();
    }, 60*1000);
}

function showRepeatPurchaseRate() {
    var query = new Keen.Query("count_unique", {
        event_collection: 'purchases',
        target_property: 'cart_id',
        group_by: 'user.uuid'
    });

    var chart = new Keen.Dataviz();

    chart
         .el(document.getElementById('repeat-purchasers'))
        .chartType('metric')
        .height(200)
        .colors(["#fff"])
        .chartOptions({
            suffix: "%"
        })
        .prepare();

    var req = window._keenClient.run(query, function(err, res){
        if (err) {
            chart.error(err.message);
        }
        else {
            var repeatPurchaser = _.filter(res.result, function(obj) {
                return obj.result > 1;
            });

            var repeatPurchaserPercentage = _.pluck(repeatPurchaser, 'user.uuid').length / _.pluck(res.result, 'user.uuid').length;

            chart
                .parseRawData({ result: 100 * repeatPurchaserPercentage })
                .title(" ")
                .render();
        }
    });

    setInterval(function(){
        chart.prepare(); // restart the spinner
        req.refresh();
    }, 60*1000);
}