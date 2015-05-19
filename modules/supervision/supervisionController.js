appContractSDSC.controller('supervisionController', ["$scope",'$filter',"commonvariable", "$modal",'Credential','Supervisors','TrackerEvent','TrackerEntityinProgram', function($scope, $filter,commonvariable,$modal,Credential,Supervisors,TrackerEvent,TrackerEntityinProgram) {

//ListContract
$scope.Currentcontract=[];
$scope.NextContract=[];
$scope.EndContract=[];
$scope.OtherContract=[];
$scope.NumContract=[];


Credential.get()
.$promise.then(function(data){
	$scope.UserId=data.userCredentials.openId;
});
//list all supervisor for search if the current user is a supervisor
Supervisors.get()
.$promise.then(function(data){
			angular.forEach(data.options, function(value, key) {
				if(value.code==$scope.UserId){
					$scope.supervisor={name:value.name, id:value.code}  
					$scope.loadlistentities(1);				
				}				
			});
		if (!$scope.supervisor){
					$scope.supervisor={name:'Usted No es Supervisor', id:''};
				}
});

///find 

$scope.loadevent=function(){
	TrackerEvent.get({
	orgUnit:commonvariable.OrganisationUnit,
	programStage:commonvariable.programStageSupervision}
	).$promise.then(function(data){
		$scope.ListContract=data.events;
		angular.forEach($scope.ListContract, function(contract,keycontract){
			angular.forEach(contract.dataValues, function(deContract,deKey){
				angular.forEach(commonvariable.DataelementSupervision, function(dataElementSup,key){
					if(deContract.dataElement==dataElementSup.supervisor && $scope.supervisor.id==deContract.value){
						$scope.finddatacontract(contract.trackedEntityInstance);
						
					}
				});
			});
		});		
	});


}

////complete data for contrate

$scope.finddatacontract=function(entity){
	angular.forEach($scope.Entities.rows, function(value,key){
		if(value[0]==entity){
			value["rCompleta"]=commonvariable.urldownload+"/"+commonvariable.folder+"/"+value.rContrato;
			var fechaContrato=value.fContrato.split("-");
			var fActual=new Date();
			
			if(fActual.getFullYear()==fechaContrato[0]){ 
				if(((fActual.getMonth()*1)+1)>(fechaContrato[1]*1)){
					$scope.Currentcontract[$scope.Currentcontract.length++]=value;
					$scope.NumContract['activos']=$scope.Currentcontract.length;
				}
				if(((fActual.getMonth()*1)+1)==(fechaContrato[1]*1)){
					$scope.NextContract[$scope.NextContract.length++]=value;
					$scope.NumContract['proximos']=$scope.NextContract.length;
				}
				if(((fActual.getMonth()*1)+1)<(fechaContrato[1]*1)){
					$scope.EndContract[$scope.EndContract.length++]=value;
					$scope.NumContract['liquidar']=$scope.EndContract.length;
				}
			}
			else{
				$scope.OtherContract[$scope.OtherContract.length++]=value;
				$scope.NumContract['otros']=$scope.OtherContract.length;	

			}
			//Contratos Actuales si estado = ACTIVE
			//por liquidar si esta activo y la fecha final del contrato es menor de la fecha actual
			//Contratos supervisados si estado != ACTIVE
		}
	});
}
///copy from filing

$scope.loadlistentities=function(nextpage){
		if($scope.search){
			$scope.likesearch="LIKE:"+$scope.search
		}
		TrackerEntityinProgram.get({
			te:commonvariable.TypeEntity,
			ou:commonvariable.OrganisationUnit,
			program:commonvariable.Program,
			ouMode:'SELECTED',
			programStatus:'ACTIVE',
			eventStartDate:commonvariable.StartDate,
			eventEndDate:commonvariable.EndDate,
			eventStatus:'ACTIVE',
			page:nextpage,
			query:$scope.likesearch
		}).$promise.then(function(data){
			$scope.Entities=data;
			$scope.numPages=data.metaData.pager.pageCount;
			$scope.loadInfomationEvent();
		 });

	}

	$scope.loadInfomationEvent=function(){
		TrackerEvent.get({
			orgUnit:commonvariable.OrganisationUnit,
			programStage:commonvariable.programStage
		}).$promise.then(function(data){
			$scope.trackerValues=data;
			$scope.findValue(data.events);
		 });
		
	}

	$scope.findValue=function(events){
		angular.forEach($scope.Entities.rows, function(eValue, eKey) {
			angular.forEach(events, function(value, key) {
				if(value.trackedEntityInstance==eValue[0]){
					angular.forEach(commonvariable.DataElement, function(dValue, dKey) {
						angular.forEach(value.dataValues, function(vValue, vKey) {
							if(vValue.dataElement==dValue){
								$scope.Entities.rows[eKey][dKey]=vValue.value;
							}
						});
					});
					$scope.Entities.rows[eKey]['DataEvent']=value;
				}
			});
		
		});
	$scope.loadevent();	
	}

	


}]);


