/** Safe(r) log function (IE breaks on console.log when debugging is not enabled!) **/
function log(msg) {
    if (typeof console !== "undefined") {
        console.log(msg);
    }
}

var Tags = (function (Backbone) {
    var TagsModel = Backbone.Model.extend({
        defaults:{
            tag: "",
            enabled: true
        },

        toggle: function() {
            this.set('enabled', !this.get('enabled'));
        }
    });

    var TagsCollection = Backbone.Collection.extend({
        url: 'tags',
        model: TagsModel,

        parse: function(response) {
            return _.map(response.tags, function(tag) {
                return new TagsModel({tag: tag, enabled: true});
            });
        },

        toggle: function(tagName) {
            _.each(this.where({tag: tagName}), function(tag) { tag.toggle() });
        },

        enabledTags: function() {
            return this.where({enabled: true});
        }
    });

    var TagsView = Backbone.View.extend({
        el:"#tags-filter",

        events:{
            "click .label":"toggleActiveLabel",
            "click #all-labels":"selectAllLabels",
            "click #no-labels":"selectNoLabels"
        },

        render:function () {
            ResourceCache.doWithResource("templates/tags.html", function (cache) {
                $(this.el).html($(Mustache.render(cache["templates/tags.html"], {tags: this.model.toJSON()})));
            }, this);
            return this;
        },

        toggleActiveLabel:function (event) {
            this.model.toggle(event.currentTarget.textContent);
            this.render();
        },

        selectAllLabels:function() {
            this.toggleAll(true);
        },

        selectNoLabels:function() {
            this.toggleAll(false);
        },

        toggleAll: function(state) {
            this.model.each(function(tag) {
                tag.set('enabled', state);
            });
            this.render();
        }
    });

    var tagsModel = new TagsModel();
    var tagsCollection = new TagsCollection();
    var tagsView = new TagsView({model:tagsCollection});

    tagsCollection.on("reset", function () {
        tagsView.render();
    });

    return {
        View:tagsView,
        Model:tagsModel,
        Collection: tagsCollection
    }
}(Backbone));


var ProductsModule = (function (Backbone) {
    var Product = Backbone.Model.extend({
        matchesTags: function(tags) {
            var modelTags = this.get('tags');
            for (var i=0; i < tags.length; i++) {
                if (_.include(modelTags, tags[i].get('tag'))) return true;
            }
            return false;
        }
    });

    var Products = Backbone.Collection.extend({
        url:'/products',
        model:Product,

        filterByTags: function(tags) {
            return new Products(this.filter(function(p) {
                return p.matchesTags(tags)
            }));
        }
    });

    return {
        Collection:Products,
        Model:Product
    }
}(Backbone));


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

        initialize: function() {
            Tags.Collection.fetch();
        },

        renderHome:function () {
            this.products = new ProductsModule.Collection();
            this.products.on('reset', this.renderProducts, this);
            this.products.fetch();
        },

        renderProducts:function () {
            $("#product-controls").show();
            renderInContentContainer(new ProductsView({model:this.products, tagsCollection: Tags.Collection}));
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
        initialize: function(options) {
            this.tagsCollection = options.tagsCollection;
            this.tagsCollection.on('change', this.render, this);
        },

        render:function () {
            ResourceCache.doWithResources(["templates/product.html"], function (cache) {
                var template = cache["templates/product.html"];
                var visibleProducts = this.model.filterByTags(this.tagsCollection.enabledTags());
                $(this.el).html($(Mustache.render(template, {"products": visibleProducts.toJSON()})));
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
            new MainRouter();
            Backbone.history.start();
        }
    }
}(Backbone));

<<<<<<< HEAD
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

=======
>>>>>>> ca9e61f4a4a6f4665cd7430c0e56ac2e91352029
$(document).ready(function () {
    App.initialize();
});


