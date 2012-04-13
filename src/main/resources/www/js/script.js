

var checkBoxTemplate = '<div class="control-group">\
                        <label class="span2">{{label}}</label>\
                        <input type="checkbox" class="span3">\
                        </div>';


$(document).ready(function() {
  $.ajax(
        { url:"templates/edit-item.html",
          type: "GET",
          success: function(result) {
          }
        });
});


