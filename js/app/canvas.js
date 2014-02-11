define(['jquery', 'underscore'], function ($, _) {
    var colors = [
        '#ffcccc',
        '#c1a3cc',
        '#ccccff',
        '#b5e2df',
        '#ffffcc',
        '#f9e0c7',
        '#e5c1f2',
        '#ccffcc'
    ];
    return {
        init: function () {
            var metrics = $('.metrics');
            this.elements = {
                canvas: $('#chart-canvas'),
                metrics: {
                    offers: metrics.find('.offers'),
                    shares: metrics.find('.shares'),
                    landings: metrics.find('.landings'),
                    leads: metrics.find('.leads'),
                    purchases: metrics.find('.purchases'),
                    friends: metrics.find('.friends')
                }
            };
            this.size = [this.elements.canvas.width(), this.elements.canvas.height()];
            this.context = this.elements.canvas[0].getContext('2d');
            this.inited = true;
        },

        render: function (campaigns) {
            if (!this.inited) {
                this.init();
            }
            var sumMetrics = this.sumMetrics(campaigns);
            var noEmpty = campaigns.length !== 0;
            var strokeStyle = '#555555';
            var _this = this;
            var i, j, jl, lb, rb, l, h;

            this.context.clearRect(0, 0, this.size[0], this.size[1]);

            if (noEmpty) {
                this.calculatePMetrics(sumMetrics, campaigns);
                for (i = 0, l = campaigns.length; i < l; i++) {
                    var m = campaigns[i].pMetrics;
                    if (i === 0) {
                        lb = [0, 0, 0, 0, 0, 0];
                    }
                    if (i === l - 1) {
                        rb = [1, 1, 1, 1, 1, 1];
                    } else {
                        rb = [lb[0]+m[0], lb[1]+m[1], lb[2]+m[2], lb[3]+m[3], lb[4]+m[4], lb[5]+m[5]];
                    }
                    this.context.beginPath();
                    this.context.moveTo(lb[0] * this.size[0], 0);
                    for (j = 1, jl = lb.length; j < jl; j++) {
                        this.context.lineTo(lb[j] * this.size[0], j * this.size[1] / (jl - 1));
                    }
                    for (j = rb.length - 1; j >= 0; j--) {
                        this.context.lineTo(rb[j] * this.size[0], j * this.size[1] / (jl - 1));
                    }
                    this.context.lineTo(lb[0] * this.size[0], 0);
                    this.context.closePath();
                    this.context.fillStyle = colors[i];
                    this.context.fill();
                    lb = rb;
                }

                for (j = 0, jl = rb.length; j < jl; j++) {
                    h = Math.round(j * this.size[1] / (jl - 1));
                    this.context.beginPath();
                    this.context.moveTo(0, h);
                    this.context.lineTo(this.size[0], h);
                    this.context.setLineDash([5]);
                    this.context.strokeStyle = strokeStyle;
                    this.context.lineWidth = 1;
                    this.context.stroke();
                    this.context.closePath();
                }
            }
            _.each(sumMetrics, function (v, k) {
                _this.elements.metrics[k].text(noEmpty ? v : '');
            });
        },

        calculatePMetrics: function (sumMetrics, campaigns) {
            _.each(campaigns, function (v) {
                var metrics = v.metrics;
                v.pMetrics = [
                    metrics.offers / sumMetrics.offers,
                    metrics.shares / sumMetrics.shares,
                    metrics.landings / sumMetrics.landings,
                    metrics.leads / sumMetrics.leads,
                    metrics.purchases / sumMetrics.purchases,
                    metrics.friends / sumMetrics.friends
                ];
            });
        },

        sumMetrics: function (campaigns) {
            return _.reduce(campaigns, function (memo, campaign) {
                _.each(campaign.metrics, function (v, k) {
                    memo[k] += v;
                });
                return memo;
            }, {offers: 0, shares: 0, landings: 0, leads: 0, purchases: 0, friends: 0});
        }
    };
});