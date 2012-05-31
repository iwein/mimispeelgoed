var Tags = (function (Backbone) {
    var TagsModel = Backbone.Model.extend({
        defaults:{
            "tags":[]
        },
        url:"tags"

    });

    var TagsView = Backbone.View.extend({
        el:"#tags-filter",

        render:function () {
            ResourceCache.doWithResource("templates/tags.html", function (cache) {
                $(this.el).html($(Mustache.render(cache["templates/tags.html"], (this.model.toJSON()))));
            }, this);
            return this;
        },

        events:{
            "click .label":"toggleActiveLabel",
            "click button#all-labels":"selectAllLabels",
            "click button#no-labels":"selectNoLabels"
        },

        toggleActiveLabel:function (event) {
            $(event.currentTarget).toggleClass("label-info active-tag");
            showProductsForActiveTags();
        },

        selectAllLabels:function (event) {
            //
        },

        selectNoLabels:function (event) {
            //
        }
    });

    var tagsModel = new TagsModel();

    var tagsView = new TagsView({model:tagsModel});


    var showProductsForActiveTags = function () {
        var activeTags = [];
        $("#tags-filter .active-tag").each(function () {
            activeTags.push($(this).text());
        });

        $(".product").each(function () {
            var self = this;
            var classes = $(self).attr("tags").trim().split(" ");
            if ($.grep(classes,
                function (elem) {
                    return $.inArray(elem, activeTags) > -1
                }).length > 0) {
                $(self).show();
            } else {
                $(self).hide();
            }
        });
    };

    tagsModel.on("change", function () {
        tagsView.render();
    });

    return {
        View:tagsView,
        Model:tagsModel
    }
}(Backbone));


var ProductsModule = (function (Backbone) {
    var Product = Backbone.Model.extend({
    });

    var Products = Backbone.Collection.extend({
        url:'/products',
        model:Product
    });

    return {
        Collection:Products,
        Model:Product
    }
}(Backbone));


var ResourceCache = (function () {
    var cache = {};

    return {
        loadResources:function (urls) {
            _.each(urls, function (url) {
                if (!cache[url]) $.get(url);
            });
        },

        doWithResource:function (url, callback, context) {
            var resource = cache[url];
            if (!resource) {
                $.get(url, function (data) {
                    cache[url] = data;
                    callback.call(context, cache)
                })
            } else {
                callback.call(context, cache);
            }
        },

        doWithResources:function (urls, callback, context) {
            var self = this;

            var doIt = _.after(urls.length, callback);
            _.each(urls, function (url) {
                self.doWithResource(url, doIt, context);
            })
        }
    };

})();

var App = (function (Backbone) {
    function renderInContentContainer(view) {
        if (this.containerView) {
            this.containerView.remove();
        }
        this.containerView = view;
        $("#content-container").html(view.render().el);
    }


    var MainRouter = Backbone.Router.extend({
        routes:{
            "":"renderHome",
            "about":"renderAbout",
            "contact":"renderContact"
        },

        renderHome:function () {
            this.products = new ProductsModule.Collection();
            this.products.bind('reset', this.renderProducts, this);
            this.products.fetch();
        },

        renderProducts:function () {
            $("#product-controls").show();
            renderInContentContainer(new ProductsView({model:this.products}));
        },

        renderAbout:function () {
            $("#product-controls").hide();
            renderInContentContainer(new AboutView());
        },

        renderContact:function () {
            $("#product-controls").hide();
            renderInContentContainer(new ContactView());
        }
    });

    var ProductsView = Backbone.View.extend({
        render:function () {
            ResourceCache.doWithResources(["templates/product.html"], function (cache) {
                var template = cache["templates/product.html"];
                $(this.el).html($(Mustache.render(template, {products:this.model.toJSON()})));
            }, this);
            return this;
        }
    });

    var AboutView = Backbone.View.extend({
        render:function () {
            ResourceCache.doWithResources(["templates/about.html"], function (cache) {
                $(this.el).html($(Mustache.render(cache["templates/about.html"])));
            }, this);
            return this;
        }
    });

    var ContactView = Backbone.View.extend({
        render:function () {
            ResourceCache.doWithResources(["templates/contact.html"], function (cache) {
                $(this.el).html($(Mustache.render(cache["templates/contact.html"])));
            }, this);
            return this;
        }
    });

    return {
        initialize:function () {
            ResourceCache.loadResources(["templates/tags.html",
                "templates/product.html",
                "templates/contact.html",
                "templates/about.html"
            ]);

            ResourceCache.doWithResource("templates/tags.html", function (tagsTemplate) {
                Tags.Model.fetch();
            });
            new MainRouter();
            Backbone.history.start();
        }
    }
}(Backbone));

var templates = new Object();

$(document).ready(function () {
    App.initialize();
});


