appContractSDSC.controller('supervisionController', ["$scope",'$filter',"commonvariable", "$modal",'Credential','Supervisors','TrackerEvent', function($scope, $filter,commonvariable,$modal,Credential,Supervisors,TrackerEvent) {

$scope.loadevent=function(){
	$scope.contractAsigned=[];
	var k=0;
	TrackerEvent.get({
	orgUnit:commonvariable.OrganisationUnit,
	programStage:commonvariable.programStageSupervision}
	).$promise.then(function(data){
		$scope.ListContract=data.events;
		angular.forEach($scope.ListContract, function(contract,keycontract){
			angular.forEach(contract.dataValues, function(deContract,deKey){
				angular.forEach(commonvariable.DataelementSupervision, function(dataElementSup,key){
					if(deContract.dataElement==dataElementSup.supervisor && $scope.supervisor.id==deContract.value){
						$scope.contractAsigned[k++]=contract;
					}
				});
			});
		});
		//Contratos Actuales si estado = ACTIVE
		//por liquidar si esta activo y la fecha final del contrato es menor de la fecha actual
		//Contratos supervisados si estado != ACTIVE
	});
}
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
					$scope.loadevent();					
				}				
			});
		if (!$scope.supervisor){
					$scope.supervisor={name:'Usted No es Supervisor', id:''};
				}
});


}]);


