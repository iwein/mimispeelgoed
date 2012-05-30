var Template = (function() {

    function renderFaded(id, html) {
        $(id).fadeOut('slow', function() {
          $(id).html(html).fadeIn('slow');
        })
    }

    return {
        // adds the template located at /templates/name.html to icanhaz, calling
        // the callback when loaded.
        loadTemplate: function(name, callback) {
            if (ich.templates[name]) {
                callback();
            } else {
                $.get('static/templates/' + name + '.html', function(template) {
                    ich.addTemplate(name, template);
                    callback();
                });
            }
        },
        // loads all the templates in the given array, calling the callback
        // when all templates were loaded.
        loadTemplates: function(templateNames, callback) {
            var countdown = templateNames.length;
            for (var i = 0; i < templateNames.length; i++) {
                this.loadTemplate(templateNames[i], function() {
                    // one template loaded, we done yet?
                    if (--countdown == 0) {
                        callback();
                    }
                });
            }
        },

        renderIntoMain: function(templateName, data) {
            this.loadTemplate(templateName, function() {
               $('#main').html(ich[templateName](data));
            });
        },


        render: function(templateName, data) {
            if (ich.templates[templateName]) {
                return ich[templateName](data);
            } else {
                this.loadTemplate(templateName, function() {
                    return ich[templateName](data);
                });
            }
        },

        renderPartial: function(templateName, selector, data) {
            if (ich.templates[templateName]) {
                var template = ich[templateName](data);
                return $(template).find(selector);
            }
            else {
                this.loadTemplate(templateName, function() {
                    var template = ich[templateName](data);
                    return $(template).find(selector);
                });
            }
        },

        // Load the given template and render it into an element matching
        // selector '#main'.
        renderInto: function(templateName, data, id) {
            if (ich.templates[templateName]) {
                $(id).html(ich[templateName](data));
            }
            else {
                this.loadTemplate(templateName, function() {
                    $(id).html(ich[templateName](data));
                });
            }
        },

        /**
         * Loads the given template and renders only the selection indicated by selector into the renderIntoId.
         */
        renderPartialTemplateInto: function(templateName, selector, data, renderIntoId) {
            if (ich.templates[templateName]) {
                var template = ich[templateName](data);
                var selection = $(template).find(selector);
                $(renderIntoId).html(selection);
            }
            else {
                this.loadTemplate(templateName, function() {
                    var template = ich[templateName](data);
                    var selection = $(template).find(selector);
                    $(renderIntoId).html(selection);
                });
            }
        },

        renderAnimatedPartialTemplateInto: function(templateName, selector, data, renderIntoId) {
            if (ich.templates[templateName]) {
                var template = ich[templateName](data);
                var selection = $(template).find(selector);
                renderFaded(renderIntoId, selection);
            }
            else {
                this.loadTemplate(templateName, function() {
                    var template = ich[templateName](data);
                    var selection = $(template).find(selector);
                    renderFaded(renderIntoId, selection);
                });
            }
        }
    };
}());