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
			$scope.TodaSupervisor=[];
			angular.forEach(contract.dataValues, function(deContract,deKey){//data value
				if(deContract.dataElement==commonvariable.dataElemntfinContrato){
					$scope.finContrato=deContract.value;
				 }

				if(deContract.dataElement==commonvariable.DataelementSupervision[4].supervisor){//supervision 4
					if(deContract.value==$scope.supervisor.id)
						$scope.TodaSupervisor[4]={'estado':'si','supervisor':deContract.value};
					else
						$scope.TodaSupervisor[4]={'estado':'no','supervisor':deContract.value};
				}
				if(deContract.dataElement==commonvariable.DataelementSupervision[3].supervisor){//supervision 3
					if(deContract.value==$scope.supervisor.id)
						$scope.TodaSupervisor[3]={'estado':'si','supervisor':deContract.value};
					else
						$scope.TodaSupervisor[3]={'estado':'no','supervisor':deContract.value};
				}
				if(deContract.dataElement==commonvariable.DataelementSupervision[2].supervisor){//supervision 2
					if(deContract.value==$scope.supervisor.id)
						$scope.TodaSupervisor[2]={'estado':'si','supervisor':deContract.value};
					else
						$scope.TodaSupervisor[2]={'estado':'no','supervisor':deContract.value};
				}
				if(deContract.dataElement==commonvariable.DataelementSupervision[1].supervisor){//supervision 1
					if(deContract.value==$scope.supervisor.id)
						$scope.TodaSupervisor[1]={'estado':'si','supervisor':deContract.value};
					else
						$scope.TodaSupervisor[1]={'estado':'no','supervisor':deContract.value};
				}
				if(deContract.dataElement==commonvariable.DataelementSupervision[0].supervisor){//supervision 0
					if(deContract.value==$scope.supervisor.id)
						$scope.TodaSupervisor[0]={'estado':'si','supervisor':deContract.value};
					else
						$scope.TodaSupervisor[0]={'estado':'no','supervisor':deContract.value};
				}
				
				//angular.forEach(commonvariable.DataelementSupervision, function(dataElementSup,key){ //dataelement
					//&& $scope.supervisor.id==deContract.value
				//	if(deContract.dataElement==commonvariable.dataElemntfinContrato){
				//		$scope.finContrato=deContract.value;
				//	}
				//	if(deContract.dataElement==dataElementSup.supervisor){
				//	$scope.finddatacontract(contract.trackedEntityInstance,$scope.supervisor.id,deContract.value,$scope.ListContract.length,$scope.finContrato,1);
				//	$scope.finContrato="";												
				//	}
				//});
			});
			$scope.finddatacontract(contract.trackedEntityInstance,$scope.TodaSupervisor,$scope.finContrato);
			$scope.finContrato="";												

		});		
	});


}

////complete data for contrate

$scope.finddatacontract=function(entity,supervisores,fechaFinal){
	var vValue=[];

	angular.forEach($scope.Entities.rows, function(value,key){
		
		if(value[0]==entity){
			vValue["rCompleta"]=commonvariable.urldownload+"/"+commonvariable.folder+"/"+value.rContrato;
			vValue["contratista"]=value[10];
			vValue["nContrato"]=value.nContrato;
			vValue["fContrato"]=value.fContrato;
			vValue["rContrato"]=value.rContrato;			
			vValue["event"]=value[0];			
			if(supervisores[supervisores.length-1].estado=="si"){					
					ms = Date.parse(fechaFinal);
					fFincontrato = new Date(ms).getTime();
	
					fActual=new Date();
					fActualm=new Date().getTime();
				    fday=fActual.getDate();
				    fmonth=fActual.getMonth()+1;
				    fyear=fActual.getFullYear();
				    var txtFecha=((fmonth==12)?fyear+1:fyear)+"-"+((fmonth==12)?1:fmonth+1)+"-"+fday;
				    fControl=new Date(txtFecha).getTime();
					if(fControl<=fFincontrato){
						$scope.Currentcontract[$scope.Currentcontract.length++]=vValue;
						$scope.NumContract['activos']=$scope.Currentcontract.length;		
					}
					else if(fActualm<=fFincontrato){
							$scope.NextContract[$scope.NextContract.length++]=vValue;
							$scope.NumContract['proximos']=$scope.NextContract.length;		
					}
					else{
						$scope.EndContract[$scope.EndContract.length++]=vValue;
						$scope.NumContract['liquidar']=$scope.EndContract.length;		
					}						
								
					
				}
				else{
					 for(var k=supervisores.length-1;k>=0;k--){
						if(supervisores[k].estado=="si"){
							$scope.OtherContract[$scope.OtherContract.length++]=vValue;
							$scope.NumContract['otros']=$scope.OtherContract.length;
						} 	
						else{
							vValue["Supervisor"]=supervisores[k].supervisor;
							$scope.RestContract[$scope.RestContract.length++]=vValue;
							$scope.NumContract['resto']=$scope.RestContract.length;
						}

					 }

				}			
			
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
  			if(vValue.dataElement==mKey){
  				if (mValue.indexOf('Ruta')!=-1) {
  					var rValue=commonvariable.urldownload+"/"+commonvariable.folder+"/"+vValue.value;
  					$scope.info[$scope.info.length-1].datavalues.push({"title":mValue,"value":rValue,"url":true});
  				}
  				else{
  					$scope.info[$scope.info.length-1].datavalues.push({"title":mValue,"value":vValue.value,"url":false});	  	
  				}
  			}
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


