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
      $(this.el).html($(Mustache.render(templates.tags, _.clone(this.model.attributes))));
    },

    events: {
      "click .label" : "toggleActiveLabel"
    },

    toggleActiveLabel: function(event) {
      $(event.currentTarget).toggleClass("label-info active-tag");
      showProductsForActiveTags();
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
    Model: tagsModel,
  }
}(Backbone));

var App = (function(Backbone){
  var MainRouter = Backbone.Router.extend({
    routes: {
      "about":"renderAbout",
      "":"renderHome"
      //,
//      "contact":"renderContact"
    },
    renderHome:function() {
      console.log("Fetching products.html");
      $.ajax(
        { url:"templates/product.html",
          type: "GET",
          success: function(productTemplate) {
            $.ajax(
                  { url:"products",
                    type: "GET",
                    success: function(json) {
                      console.log("Rendering products");
                      var data = new Object();
                      data.products = eval(json);
                      console.log(data);
                      var elem = $(Mustache.render(productTemplate, data));
                      $("#content-container").html(elem);
                      $("#product-controls").show();
                    }
                  });
          }
        });
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
    }
  });
  return {
    Router: new MainRouter()
  }
}(Backbone));

var templates = new Object();


$(document).ready(function() {
  Backbone.history.start();
  $.ajax({
          url: "templates/tags.html",
          type: "GET",
          success: function(tagsTemplate) {
            templates.tags = tagsTemplate;
            Tags.Model.fetch();
          }
        }
  );

  $.ajax(
        { url:"templates/product.html",
          type: "GET",
          success: function(productTemplate) {
            $.ajax(
                  { url:"products",
                    type: "GET",
                    success: function(json) {
                      var data = new Object();
                      data.products = eval(json);
                      console.log(data);
                      var elem = $(Mustache.render(productTemplate, data));
                      $("#content-container").html(elem);
                    }
                  });
          }
        });
});


