var checkBoxTemplate = '<div class="control-group">\
                        <label class="span2">{{label}}</label>\
                        <input type="checkbox" class="span3">\
                        </div>';


$(document).ready(function() {
  $.ajax(
        { url:"templates/edit-item.html",
          type: "GET",
          success: function(template) {
            $.ajax(
                  { url:"products",
                    type: "GET",
                    success: function(json) {
                      var data = new Object();
                      data.products = eval(json);
                      console.log(data);
                      var elem = $(Mustache.render(template, data));
                      $("#product-container").html(elem);
                    }
                  });
          }
        });
});


