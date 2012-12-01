selectn
=======

jQuery plugin to convert select dropdowns (multiple=true) into dropdowns of checkboxes

Usage:

    <link rel="stylesheet" type="text/css" href="jquery.selectn.css">
    <script type="text/javascript" src="jquery.selectn.js">
    <script type="text/javascript">
      $(document).ready(function() {
        $("select[multiple]").selectn("destroy");
        $("select[multiple]").selectn();
      });
    </script>

