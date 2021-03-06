Handlebars.templates = Handlebars.templates || {};


// template --- tmpl-D3JSContactCluster ---
Handlebars.templates['tmpl-D3JSContactCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"D3JSContactCluster\">\n		<div class=\"D3JSContactClusterSummary\"></div>\n	</div>";}
);

// template --- tmpl-EaselJSContactCluster ---
Handlebars.templates['tmpl-EaselJSContactCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"EaselJSContactCluster\">\n		<div class=\"EaselJSContactClusterSummary\"></div>\n	</div>";}
);

// template --- tmpl-EaselJSTweenContactCluster ---
Handlebars.templates['tmpl-EaselJSTweenContactCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"EaselJSTweenContactCluster\">\n		<div class=\"ClusterChart\"></div>\n		<div class=\"contact-info\"></div>\n		<div class=\"contact-toolbar\">\n			<div class=\"toolItems\">\n				<div class=\"toolbar-item\">\n					<label>Use RAF: </label> \n					<div class=\"toolbar-item-content useRAF\">\n						<input type=\"checkbox\"/>\n					</div>\n				</div>\n				<div class=\"toolbar-item\">\n					<label>Animation: </label> \n					<div class=\"toolbar-item-content animation\">\n						<input name=\"targetType\" type=\"radio\" value=\"tween\"><span>Tween</span>\n						<input name=\"targetType\" type=\"radio\" value=\"tick\"><span>Tick</span>\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>";}
);

// template --- tmpl-ForceDirectedCluster ---
Handlebars.templates['tmpl-ForceDirectedCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"ForceDirectedCluster\">\n		<div class=\"container\">\n			<p>\n			  <label for=\"RAF\">RAF:</label>\n			  <input type=\"checkbox\" id=\"RAF\" />\n			</p>\n			\n			<p>\n			  <label for=\"level\">AnimationSpeed:</label>\n			  <input type=\"text\" value=\"500\" id=\"speed\" style=\"border: 0; color: #f6931f; font-weight: bold;\" placeholder=\"500\" />\n			</p>\n			\n			<p>\n			  <label for=\"level\">Level:</label>\n			  <input type=\"text\" id=\"level\" style=\"border: 0; color: #f6931f; font-weight: bold;\" />\n			</p>\n	 \n			<div id=\"level-slider\"></div>\n			\n			<p>\n			  <label for=\"zoom\">Zoom:</label>\n			  <input type=\"text\" id=\"zoom\" style=\"border: 0; color: #f6931f; font-weight: bold;\" />\n			</p>\n	 \n			<div id=\"zoom-slider\"></div>			\n		</div>\n		<div class=\"canvas-container\">\n			<canvas id='demoCanvas'></canvas>\n		</div>\n	</div>";}
);

// template --- tmpl-MainScreen ---
Handlebars.templates['tmpl-MainScreen'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"MainScreen\">\n	    <div class=\"MainScreen-header\">\n	    </div>\n	    <div class=\"MainScreen-main\">\n	    </div>\n    </div>";}
);

// template --- tmpl-ReportHeader ---
Handlebars.templates['tmpl-ReportHeader'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"ReportHeader\">\n		<div class=\"navbar  navbar-inverse navbar-fixed-top\">\n		  <div class=\"navbar-inner\">\n		    <a class=\"brand\" href=\"#\">D3JS Demo</a>\n		    <ul class=\"nav\">\n		      <li data-nav=\"UserWeight\" class=\"menu\">UserWeight</li>\n		      <li data-nav=\"UserWeightD3Cluster\" class=\"menu\">UserWeightD3Cluster</li>\n		      <li data-nav=\"D3JSContactCluster\" class=\"menu\">D3JSContactCluster</li>\n		      <li data-nav=\"EaselJSContactCluster\" class=\"menu\">EaselJSContactCluster</li>\n		      <li data-nav=\"EaselJSTweenContactCluster\" class=\"menu\">EaselJSTweenContactCluster</li>\n		      <li data-nav=\"ForceDirectedCluster\" class=\"menu active\">ForceDirectedCluster</li>\n		    </ul>\n		  </div>\n		</div>\n	</div>";}
);

// template --- tmpl-UserWeight ---
Handlebars.templates['tmpl-UserWeight'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"UserWeight\">\n		<div class=\"UserWeightSummary\"></div>\n	</div>";}
);

// template --- tmpl-UserWeightD3 ---
Handlebars.templates['tmpl-UserWeightD3'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"UserWeightD3\">\n		<div class=\"UserWeightD3Summary\"></div>\n	</div>";}
);

// template --- tmpl-UserWeightD3Cluster ---
Handlebars.templates['tmpl-UserWeightD3Cluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"UserWeightD3Cluster\">\n		<div class=\"UserWeightD3ClusterSummary\"></div>\n	</div>";}
);
