/*
 *	Architeture 
 * 	Helder Yesid Castrillón
 * 	Hisp Colombia 2014
 * 
 * Core Module for using WebApi of dhis2
 * It is the persistence in the FrontEnd
 * 
 * */
var Dhis2Api = angular.module("Dhis2Api", ['ngResource']);

//Create all common variables of the apps 
Dhis2Api.factory("commonvariable", function () {
	var dtformated="";
	var today = function() {
	    var datetoday = new Date();
	    dtformated=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate()); 
	};
	 today();
	var Vari={
			url:"http://190.146.87.62/dhis/api/",
            urlbase:"http://190.146.87.62/dhis/",
            urldownload:"http://190.146.87.62/externalfiledhis/",
            urlupload:"../../../upload/upload.php",
			folder:"Contratos",
			supersupervisor:"tvjWDzNXSPs",
			OrganisationUnit:"z37AIsY28kM",
			TypeEntity:"WkBTuQkUtRM",
			Program:"kmwWsj13wN0",
			programStage:"rQFeRuU0y2T",
			titleStage:{"rQFeRuU0y2T":"Datos de Contrato","bvCkspOICM2":"Supervisiones","cn40nP9xGEc":"Otro si","wDsngDttajx":"Ejecucion"},
			programStageSupervision:"bvCkspOICM2",
			dataElemntfinContrato:"DQOjb8hiCLX",
			dataElementOtrosi:"",
			StartDate:'2015-01-01',
			EndDate:dtformated,
			DataelementSupervision:[{"supervisor":"bdyUU11MQBn"},
					{"supervisor":"cz3VzXDTVEi"},
					{"supervisor":"koO1JoJAFez"},
					{"supervisor":"wZQnL1ovhli"},
					{"supervisor":"AQLrFg5COzF"}],
			DataElement:{"nContrato":"iIpswT0zho9","fContrato":"QkcfD67ZZhZ","rContrato":"B1UpXqZ48iX","rSupervision":"DUPFn7tCJJn","dJLaFwIe1bM":"Ejecucion"},
			Period:"",
			DataSet:"",
			Entity:"",
			Fileupload:{"status":"waiting"}
			};

   return Vari; 
});

Dhis2Api.factory("userAuthorization", ['$resource','commonvariable',function($resource,commonvariable) {
	return $resource(commonvariable.url + "me/authorization/:menuoption",
		{
			menuoption:'@menuoption'
		},
		{ get: { method: "GET", transformResponse: function (response) {return {status: response};}	}});

}]);
Dhis2Api.factory("Credential",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource( commonvariable.url+"me", 
	{fields:'userCredentials[name,code,openId,userRoles]'},
  { get: { method: "GET"}
  });
}]);

Dhis2Api.factory("Supervisors",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource( commonvariable.url+"optionSets/H6K1g3cTydR", 
	{},
  { get: { method: "GET"}
  });
}]);

Dhis2Api.factory("TrackerEvent",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource( commonvariable.url+"events", 
	{orgUnit:'@orgUnit',
	programStage:'@programStage'
	},
  { get: { method: "GET"}
  });
}]);

Dhis2Api.factory("TrackerEntityinProgram",['$resource','commonvariable', function ($resource,commonvariable) {
	return $resource( commonvariable.url+"trackedEntityInstances", 
	{te:'@te',
	ou:'@ou',
	program:'@program',
	ouMode:'@ouMode',
	programStatus:'@programStatus',
	eventStartDate:'@eventStartDate',
	eventEndDate:'@eventEndDate',
	eventStatus:'@eventStatus'},
  { get: { method: "GET"},
	post: { method: "POST"},
	remove: {method:'DELETE'}
  });
}]);
