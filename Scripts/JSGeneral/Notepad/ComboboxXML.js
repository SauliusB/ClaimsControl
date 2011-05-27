<meta charset="utf-8">
	
	
	
	
	
	
	
	
	<style>
	.ui-autocomplete-loading { background: white url('images/ui-anim_basic_16x16.gif') right center no-repeat; }
	</style>
	<script>
	$(function() {
		function log( message ) {
			$( "<div/>" ).text( message ).prependTo( "#log" );
			$( "#log" ).attr( "scrollTop", 0 );
		}

		$.ajax({
			url: "london.xml",
			dataType: "xml",
			success: function( xmlResponse ) {
				var data = $( "geoname", xmlResponse ).map(function() {
					return {
						value: $( "name", this ).text() + ", " +
							( $.trim( $( "countryName", this ).text() ) || "(unknown country)" ),
						id: $( "geonameId", this ).text()
					};
				}).get();
				$( "#birds" ).autocomplete({
					source: data,
					minLength: 0,
					select: function( event, ui ) {
						log( ui.item ?
							"Selected: " + ui.item.value + ", geonameId: " + ui.item.id :
							"Nothing selected, input was " + this.value );
					}
				});
			}
		});
	});
	</script>



<div class="demo">

<div class="ui-widget">
	<label for="birds">London matches: </label>
	<input id="birds" />
</div>

<div class="ui-widget" style="margin-top:2em; font-family:Arial">
	Result:
	<div id="log" style="height: 200px; width: 300px; overflow: auto;" class="ui-widget-content"></div>
</div>

</div><!-- End demo -->



<div class="demo-description">
<p>This demo shows how to retrieve some XML data, parse it using jQuery's methods, then provide it to the autocomplete as the datasource.</p>
<p>This should also serve as a reference on how to parse a remote XML datasource - the parsing would just happen for each request within the source-callback.</p>
</div><!-- End demo-description -->
