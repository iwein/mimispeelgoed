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
    console.log(event);
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
  }

var templates = new Object();


$(document).ready(function() {
  tagsModel.fetch();

  $.ajax({
          url: "templates/tags.html",
          type: "GET",
          success: function(tagsTemplate) {
            templates.tags = tagsTemplate;
            tagsModel.on("change", function(){
              console.log("Changed!");
              tagsView.render();
            });
//            $.ajax({
//              url: "tags",
//              type: "GET",
//              success: function(jsonTags) {
//                var data = new Object();
//                data.tags = eval(jsonTags);
//                console.log(jsonTags);
//                $("#tags-filter").html($(Mustache.render(tagsTemplate, data)));
//              }
//            });
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
                      $("#product-container").html(elem);
                    }
                  });
          }
        });
});


