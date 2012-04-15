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


$(document).ready(function() {
  $.ajax({
          url: "templates/tags.html",
          type: "GET",
          success: function(tagsTemplate) {
            $.ajax({
              url: "tags",
              type: "GET",
              success: function(jsonTags) {
                var data = new Object();
                data.tags = eval(jsonTags);
                console.log(jsonTags);
                $("#tags-filter").html($(Mustache.render(tagsTemplate, data)));
                $("#tags-filter .label").click(function(target) {
                  $(this).toggleClass("label-info active-tag");
                  showProductsForActiveTags();
                });              }
            });
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


