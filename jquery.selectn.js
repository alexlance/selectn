selectn_unique_select_id_counter = 1;
;(function($) {
  var methods = {

    // Convert multi-selects into checkboxes
    init : function(options) { 
      this.each(function() {

        // The <select> dropdown
        var select = $(this);
        var select_id = select.attr("id");

        // Give the <select> dropdown an id, if it is missing one
        if (!select_id) {
          select.attr("id","selectn-id-"+selectn_unique_select_id_counter++);
        }

        // First make a label for the closed dropdown list
        var label = $("<span/>",{"class":"selectn-label", "data-select-id":select.attr("id")});
        label.width(select.width());

        // Put the selected options into the label span and add the label's icon
        methods.set_label(label, select);
        select.parent().append(label);

        // Three extra buttons for: all, none, and invert
        var op_all = $("<button/>",{"name":"all",   "type":"button","class":"selectn-button"}).text("all").get(0).outerHTML;
        var op_non = $("<button/>",{"name":"none",  "type":"button","class":"selectn-button"}).text("none").get(0).outerHTML;
        var op_inv = $("<button/>",{"name":"invert","type":"button","class":"selectn-button"}).text("toggle").get(0).outerHTML;

        // Gather up all the options from the <select> dropdown
        var dropdown_ops = [];
        dropdown_ops[dropdown_ops.length] = "<div style='margin:4px;'>"+op_all+" "+op_non+" "+op_inv+"</div>";
        select.find("option").each(function(i, option){ 
          var cb_ops = {"type":"checkbox", "value":$(option).val(), "class":"selectn-cb", "checked":$(option).attr("selected")};
          dropdown_ops[dropdown_ops.length] = "<label>"+$("<input/>",cb_ops).get(0).outerHTML+" "+$(option).text().trim()+"</label>";
        });
      
        // Create a dropdown box, that has selectable checkboxes in it
        var dropdown = $("<span/>",{ "class": "selectn-dropdown" });
        dropdown.css("min-width",label.width());

        // Create the checkboxes
        dropdown.append(dropdown_ops);
        select.parent().append(dropdown);

        // Open the dropdown when the label is clicked
        label.click(function(){
          var p = $(this).position();
          dropdown.css({"position":"absolute", "left": p.left+"px", "top":p.top+$(this).height()+1+"px" });
          if (dropdown.is(":visible")) {
            methods.close_all();
          } else {
            methods.close_all();
            $(this).addClass("selectn-active");
            dropdown.addClass("selectn-active");
            dropdown.show();
          }
        });

        // Listen for the all, none, or invert, buttons to be pressed
        $(".selectn-button",dropdown).click(function(){
          if ($(this).attr("name") == "all") {
            $(".selectn-cb",dropdown).each(function(){
              $(this).attr("checked",true);
              $(this).trigger('change');
            });
          } else if ($(this).attr("name") == "none") {
            $(".selectn-cb",dropdown).each(function(){
              $(this).attr("checked",false);
              $(this).trigger('change');
            });
          } else if ($(this).attr("name") == "invert") {
            $(".selectn-cb",dropdown).each(function(){
              $(this).attr("checked",!$(this).is(':checked'));
              $(this).trigger('change');
            });
          }
        });

        // When the checkboxes are clicked, update the original <select> (which is hidden, but still submitted).
        $(".selectn-cb",dropdown).change(function(e){
          setTimeout(function(){
            var ops = [];
            $(".selectn-cb",dropdown).each(function(){
              if ($(this).attr("checked")) {
                ops.push($(this).val());
              }
            });
            select.val(ops);
            methods.set_label(label,select);
          },1);
        });

        // Hide the original <select> dropdown.
        select.hide(); 
      });        

      return this;
    },

    // Update the text inside the label when the selected options are changed
    set_label : function (label, select) {
      var label_str = '', comma = '';
      select.find("option").each(function(i, option){ 
        if ($(option).attr("selected")) {
          label_str += comma+$(option).text().trim(); 
          comma = ", ";
        }
      });
      // Put the selected options into the label span and add the label's icon
      label.text(label_str);
      label.append($("<img/>",{"src":"../images/selectn.gif"}));
    },

    // Close all dropdowns
    close_all : function() {
      $(".selectn-label.selectn-active").each(function(){
        var select = $("#"+$(this).attr("data-select-id"));
        var dropdown = $(this).next(".selectn-dropdown.selectn-active");
        $(this).removeClass("selectn-active"); 
        dropdown.removeClass("selectn-active");
        dropdown.hide();
        $(this).trigger("selectn-closed",{"label":$(this), "dropdown":dropdown, "select":select});
      });
    },

    // Nuke the selectors, useful if you want to redraw
    destroy : function(context) { 
      $(".selectn-label",context).remove();
      $(".selectn-dropdown",context).remove();
    }
  };
    
  // jQuery module stuff
  $.fn.selectn = function(method) {
    if (methods[method]) {
      return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
    } else if (typeof method === 'object' || !method) {
      return methods["init"].apply(this,arguments);
    } else {
      $.error('Method '+method+' does not exist on jQuery.selectn');
    }
  }

})(jQuery);


$("html").click(function(e) {
  if (!$(e.target).is('.selectn-dropdown *') && !$(e.target).is('.selectn-label') && !$(e.target).is('.selectn-label *')) {
    $(document).selectn("close_all");
  }
});

$("html").on('keydown', function(e) {
  if (e.keyCode === 27 ) { // ESC
    $(document).selectn("close_all");
  }
});

