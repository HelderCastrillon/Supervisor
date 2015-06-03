appContractSDSC.controller('supervisionController', ["$scope",'$filter',"commonvariable", "$modal",'Credential','Supervisors','TrackerEvent','TrackerEntityinProgram','$log', function($scope, $filter,commonvariable,$modal,Credential,Supervisors,TrackerEvent,TrackerEntityinProgram,$log) {

//ListContract
$scope.Currentcontract=[];
$scope.NextContract=[];
$scope.EndContract=[];
$scope.OtherContract=[];
$scope.NumContract=[];
$scope.RestContract=[];
$scope.previus={};
$scope.contcontratos=0;

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
		var kcontract=0;
		angular.forEach($scope.ListContract, function(contract,keycontract){ //list register
			kcontract++;
			angular.forEach(contract.dataValues, function(deContract,deKey){//data value
				angular.forEach(commonvariable.DataelementSupervision, function(dataElementSup,key){ //dataelement
					//&& $scope.supervisor.id==deContract.value
					if(deContract.dataElement==commonvariable.dataElemntfinContrato){
						$scope.finContrato=deContract.value;
					}
					if(deContract.dataElement==dataElementSup.supervisor){
					$scope.finddatacontract(contract.trackedEntityInstance,$scope.supervisor.id,deContract.value,$scope.ListContract.length,$scope.finContrato,1);
					$scope.finContrato="";												
					}
				});
			});
		});		
	});


}

////complete data for contrate

$scope.finddatacontract=function(entity,login,supervisorContract,total,fechaFinal,p){
	angular.forEach($scope.Entities.rows, function(value,key){
		
		if(value[0]==entity){
			value["rCompleta"]=commonvariable.urldownload+"/"+commonvariable.folder+"/"+value.rContrato;
			value["Supervidor"]=supervisorContract;
			//console.log((login==supervisorContract?"SI":"NO")+($scope.previus.entity==entity?" EntitiySi":" EntitiyNo")+ ($scope.previus.supervisor==login?" SupSI":" SupNO") + " Login "+login+",Supervisor "+supervisorContract+", Entidad "+value[10]);
			if($scope.previus.supervisor==login){		
				if($scope.previus.entity!=entity){					
					ms = Date.parse(fechaFinal);
					
					fFincontrato = new Date(ms).getTime();
					
					fActual=new Date();
					fActualm=new Date().getTime();
				    fday=fActual.getDate();
				    fmonth=fActual.getMonth()+1;
				    fyear=fActual.getFullYear();
				    var txtFecha=((fmonth==12)?fyear+1:fyear)+"-"+((fmonth==12)?1:fmonth+1)+"-"+fday;
				    fControl=new Date(txtFecha).getTime();
				    
				    console.log(fActualm);
				    console.log(fControl);
					console.log(fFincontrato);
					console.log(txtFecha);
					if(fControl<=fFincontrato){
						$scope.Currentcontract[$scope.Currentcontract.length++]=$scope.previus.value;
						$scope.NumContract['activos']=$scope.Currentcontract.length;		
					}
					else if(fActualm<=fFincontrato){
							$scope.NextContract[$scope.NextContract.length++]=$scope.previus.value;
							$scope.NumContract['proximos']=$scope.NextContract.length;		
					}
					else{
						$scope.EndContract[$scope.EndContract.length++]=$scope.previus.value;
						$scope.NumContract['liquidar']=$scope.EndContract.length;		
					}						
								
					
				}
				else{
					$scope.OtherContract[$scope.OtherContract.length++]=value;
					$scope.NumContract['otros']=$scope.OtherContract.length;	
				}			
			}
			if(login!=supervisorContract){
				Othercontract={
					"numeración":$scope.contcontratos++,
					"Contratista":value[10],
					"Supervisor":supervisorContract,
					"nContrato":value.nContrato,
					"fContrato":value.fContrato,
					"rContrato":value.rContrato};
			
				$scope.RestContract[$scope.RestContract.length++]=Othercontract;
				$scope.NumContract['resto']=$scope.RestContract.length;
			}
			$scope.previus={"entity":entity,"supervisor":supervisorContract,"value":value};
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



///Modal

 $scope.animationsEnabled = true;

  $scope.openAditionalInfo = function (info) {
  	var dinfo={
  		trackedEntityInstance:info,
  		orgUnit:commonvariable.OrganisationUnit,
  		program:commonvariable.Program
  	};

  	TrackerEvent.get({
			trackedEntityInstance:info,
  			orgUnit:commonvariable.OrganisationUnit,
  			program:commonvariable.Program,
  			paging:false
		}).$promise.then(function(data){
			$scope.trackerValues=data;

			var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'ModalContentSupervisor.html',
		      controller: 'ModalInstanceCtrlSupervision',
		      resolve: {
		        infoSupervisor: function () {
		          return $scope.trackerValues;
		        }
		      }
		    });

		     modalInstance.result.then(function (selectedItem) {
			      $scope.selected = selectedItem;
			    }, function () {
			      $log.info('Modal dismissed at: ' + new Date());
			    });
			 });

	 };

   

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

  /////end modal


}]);

appContractSDSC.controller('ModalInstanceCtrlSupervision', function ($scope, $modalInstance, infoSupervisor,commonvariable) {

  $scope.info=[];
  angular.forEach(infoSupervisor.events, function(eValue, eKey) {
  	console.log(eValue.programStage);
  	console.log(commonvariable.titleStage);
  	$scope.info.push({"title":commonvariable.titleStage[eValue.programStage],"uid":eValue.programStage,"datavalues":[]});
  	angular.forEach(eValue.dataValues, function(vValue, vKey) {
  		angular.forEach(infoSupervisor.metaData.de, function(mValue, mKey) {
  			if(vValue.dataElement==mKey)
  				$scope.info[$scope.info.length-1].datavalues.push({"title":mValue,"value":vValue.value});	  	
  		});
  	});  	
  });

  $scope.selected = {
    item: 1
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


