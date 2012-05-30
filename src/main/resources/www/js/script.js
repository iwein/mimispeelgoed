var Tags = (function (Backbone) {
  var TagsModel = Backbone.Model.extend({
    defaults: {
      "tags" : []
    },
    url: "tags"

  });

  var TagsView = Backbone.View.extend({
    el: "#tags-filter",

    render: function() {
      ResourceCache.doWithResource("templates/tags.html", function(cache, context){
        $(context.el).html($(Mustache.render(cache["templates/tags.html"], _.clone(context.model.attributes))));
      } , this);
    },

    events: {
      "click .label" : "toggleActiveLabel",
      "click button#all-labels": "selectAllLabels",
      "click button#no-labels": "selectNoLabels"
    },

    toggleActiveLabel: function(event) {
      $(event.currentTarget).toggleClass("label-info active-tag");
      showProductsForActiveTags();
    },

    selectAllLabels: function(event) {
      //
    },

    selectNoLabels: function(event) {
      //
    }
  });

  var tagsModel = new TagsModel();

  var tagsView = new TagsView({model:tagsModel});


  var showProductsForActiveTags = function() {
    var activeTags = [];
    $("#tags-filter .active-tag").each(function() {
      activeTags.push($(this).text());
    });

    $(".product").each(function() {
      var self = this;
      var classes = $(self).attr("tags").trim().split(" ");
      if ($.grep(classes,
            function(elem) {
              return $.inArray(elem, activeTags) > -1
            }).length > 0) {
        $(self).show();
      } else {
        $(self).hide();
      }
    });
  };

  tagsModel.on("change", function() {
    tagsView.render();
  });

  return {
    View: tagsView,
    Model: tagsModel
  }
}(Backbone));

var ResourceCache = (function() {
  var cache = {};

  return {
    loadResources:function(urls) {
      _.each(urls, function(url){
        if (!cache[url]) $.get(url);
      });
    },

    doWithResource:function(url, callback, context) {
     var resource = cache[url];
     if (!resource) {
       $.get(url, function(data){
         cache[url] = data;
         callback(cache, context)
       })
     } else {
       callback(cache, context);
     }
    },

    doWithResources:function(urls, callback, context) {
      var self = this;

      var doIt = _.after(urls.length, callback);
      _.each(urls, function(url){
        self.doWithResource(url, doIt, context);
      })
    }
  };

})();

var App = (function(Backbone){

  var Product = Backbone.Model.extend({});

  var Products = Backbone.Collection.extend({
    url: '/products',
    model: Product
  });


  var MainRouter = Backbone.Router.extend({
    routes: {
      "":"renderHome",
      "about":"renderAbout",
      "contact":"renderContact"
    },
    renderHome:function() {
      console.log("Render Home - Fetching products.html");
      ResourceCache.doWithResources(["templates/product.html", "products"], function(cache){
        var products = {products: eval(cache["products"])};
        var template = cache["templates/product.html"];
        var elem = $(Mustache.render(template, products));
        $("#content-container").html(elem);
        $("#product-controls").show();
      });
    },

    renderProducts: function() {
      console.log('render products here...');
    },

    renderAbout:function() {
      console.log("Fetching about.html");
      $.ajax(
            { url:"templates/about.html",
              type: "GET",
              success: function(aboutTemplate) {
                console.log("Rendering about");
                var elem = $(Mustache.render(aboutTemplate));
                $("#content-container").html(elem);
                $("#product-controls").hide();
              }
            });
    },
    renderContact:function() {
      console.log("Fetching contact.html");
      $.ajax(
            { url:"templates/contact.html",
              type: "GET",
              success: function(aboutTemplate) {
                console.log("Rendering contact");
                var elem = $(Mustache.render(aboutTemplate));
                $("#content-container").html(elem);
                $("#product-controls").hide();
              }
            });
    }
  });
  return {
    Router: new MainRouter()
  }
}(Backbone));

var templates = new Object();


$(document).ready(function() {
  ResourceCache.loadResources(["templates/tags.html",
    "templates/product.html",
    "templates/contact.html",
    "templates/about.html"
  ]);

  Backbone.history.start();
  ResourceCache.doWithResource("templates/tags.html", function(tagsTemplate) {
    Tags.Model.fetch();
  });
});


