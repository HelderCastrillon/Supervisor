var appContractSDSC = angular.module("appContractSDSC", ['ngRoute','Dhis2Api','pascalprecht.translate','ui.bootstrap','d2Menu']);

appContractSDSC.config(function($routeProvider) {
 
	  $routeProvider.when('/supervision', {
		    templateUrl: "modules/supervision/supervisionView.html",
		    controller: "supervisionController"
		  });
	   $routeProvider.otherwise({
	        redirectTo: '/supervision'
	  });   

	});

appContractSDSC.config(function ($translateProvider) {
  
	  $translateProvider.useStaticFilesLoader({
          prefix: 'languages/',
          suffix: '.json'
      });
	  
	  $translateProvider.registerAvailableLanguageKeys(
			    ['es', 'en'],
			    {
			        'en*': 'en',
			        'es*': 'es',
			        '*': 'en' // must be last!
			    }
			);
	  
	  $translateProvider.fallbackLanguage(['en']);
	  $translateProvider.determinePreferredLanguage();
	  //$translateProvider.use('es');
	  
});