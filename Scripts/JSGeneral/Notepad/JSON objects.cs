 public jsonArrays GetJSON_tblAccidents() {
         jsonArrays JSON = new jsonArrays();
         object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateNotMore,DateNoLess,Time,AlphaNum
				new { FName = "ID"},//0
				new { FName = "AccidentTypeID", Tip="Pasirinkite ið sàraðo",List=new{Source="tblClaimTypes",iVal=0,iText=new object[]{1},Editable=0,ListType="List"}},//1
				//new { FName = "AccountID"},//2
				new { FName = "DriverID",Tip="Pradëkite vesti..", List=new{Source="tblDrivers",iVal=0,iText=new object[]{1,2},Editable=1,ListType="List"}},//3
				new { FName = "No",Valid=new{Type="Integer"},Validity="require().match('integer')"},//4
				new { FName = "Date",Valid=new{Type="DateTimeNotMore", Default="today"},Validity="require().match('date').lessThanOrEqualTo(new Date())"},//5
				new { FName = "IsNotOurFault",Valid=new{Type="boolean"}},//6
				new { FName = "IsOtherParticipants",Valid=new{Type="boolean"}},//7
				new { FName = "ShortNote", Tip="Vienu sakiniu..",Valid=new{Type="AlphaNumSpace", LenMax=100},Validity="require().nonHtml().maxLength(100)"},//8
				new { FName = "LongNote",Tip="Papildoma informacija, pastabos, uþraðai ir pan.",Valid=new{Type="AlphaNumSpace", LenMax=800},Validity="require().nonHtml().maxLength(800)"},//9
				new { FName = "LocationCountry",Valid=new{Type="AlphaNumSpace", LenMax=100},Validity="require().nonHtml().maxLength(100)"},//10
				new { FName = "LocationAddress",Valid=new{Type="AlphaNumSpace", LenMax=400},Validity="require().nonHtml().maxLength(400)"},//11
				new { FName = "LocationDistrict",Valid=new{Type="AlphaNumSpace", LenMax=80},Validity="require().nonHtml().maxLength(80)"},//12
				new { FName = "Lat",Valid=new{Type="Decimal", LenEqual=10},Validity="require().match('number')"},//13
				new { FName = "Lng",Valid=new{Type="Decimal", LenEqual=10},Validity="require().match('number')"},//14
				new { FName = "GMT",Valid=new{Type="Integer"},Validity="require().match('integer')"}//15
			}; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Accidents", tblUpdate = "tblAccidents" };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
					new {sTitle="Ávykio tipas"},//1//AccidentTypeID////DefaultUpdate=0
					//new {bVisible=false,bSearchable=false},//2//AccountID////DefaultUpdate=0
					new {sTitle="Atsakingas vairuotojas",bVisible=false,bSearchable=false},//3//DriverID////DefaultUpdate=0
					new {sTitle="Nr"},//4//No//
					new {sTitle="Ávykio data ir laikas (vietos laiku)"},//5//Date//
					new {sTitle="Kaltininkas treèia ðalis"},//6//IsOurFault//
					new {sTitle="Daugiau nei vienas kaltininkas"},//7//IsOtherParticipants//
					new {sTitle="Ávykio apibûdinimas",sClass="smallFont"},//8//ShortNote//
					new {sTitle="Pastabos",sClass="smallFont"},//9//LongNote//
					new {sTitle="Ðalis",sClass="smallFont"},//10//LocationCountry//
					new {sTitle="Adresas",sClass="smallFont"},//11//LocationAddress//
					new {sTitle="Rajonas",sClass="smallFont"},//12//LocationDistrict//
					new {sTitle="Lat"},//13//Lat//
					new {sTitle="Lng"},//14//Lng//
					new {sTitle="GMT"}//15//GMT//
				},
            aaSorting = new object[] { new object[] { 4, "asc" } },
         };
         return JSON;
      }
      
	  
	  public jsonArrays GetJSON_tblClaims() {
         jsonArrays JSON = new jsonArrays();
         JSON.Data = from d in dc.tblClaims join a in dc.tblAccidents on d.AccidentID equals a.ID
                     where d.IsDeleted == false && a.AccountID == UserData.AccountID
                     select new object[] {
            d.ID,//0
            d.ClaimTypeID,//1
            d.AccidentID,//2
            d.InsPolicyID,//3
            d.VehicleID,//4
            d.No,//5
            d.IsTotalLoss,//6
            d.LossAmount,//7
            d.InsuranceClaimAmount,//8
            d.IsInjuredPersons,//9
            d.InsurerClaimID,//10
            d.ClaimStatus,//11
            d.AmountIsConfirmed,//12
            d.Days,//13
            d.PerDay//14
            };
         //Datepicker ir plugin on blur
         //Valid.Type:Date,DateCtrl,DateNotLessCtrl,DateNotMoreCtrl,Year,YearNotMore,YearNotLess,Integer,Decimal
         //NotImplemented:AlphaNum,AlphaNumSpace,NotEditable=true,LenMax/LenEqual/LenMin:10

         //GenerateHTML
         //Valid.Type:boolean(checkbox),substring(0,4)==="Date"(Date),LenMax>100(textarea)
         //else if Cols[i].List(List)else text
         //Valid:IsUnique=new object[]{1,2}
         //Valid:Default=today
         //Tip="Pradëkite vesti.."
         //List=new{Source="tblVehicleMakes",Val=0,Text=new object []{1}}
         object[] Cols ={
            new { FName = "ID"},//0
            new { FName = "ClaimTypeID",Tip="Pasirinkite þalos tipà..", List=new{Source="tblClaimTypes",iVal=0,iText=new object[]{1},Editable=0,ListType="List"}},//1
            new { FName = "AccidentID"},//2
            new { FName = "InsPolicyID",Tip="Pasirinkite ið sàraðo..", List=new{Source="tblInsPolicies",iVal=0,iText=new object[]{1,2},Editable=1,ListType="List",Append=new{id=0,value="Neapdrausta"}}},//3
            new { FName = "VehicleID",Tip="Valst.Nr., markë, modelis arba metai..", List=new{Source="tblVehicles",iVal=0,iText=new object[]{1,2,3,4},Editable=1,ListType="None"}},//4
            new { FName = "No",Valid=new{Type="Integer", LenMax=10},Validity="require().match('integer').maxLength(13).greaterThanOrEqualTo(0)"},//5
            new { FName = "IsTotalLoss",Valid=new{Type="boolean"}},//6
            new { FName = "LossAmount",Valid=new{Type="Decimal", LenMax=15},Validity="require().match('number').greaterThanOrEqualTo(0)"},//7
            new { FName = "InsuranceClaimAmount",Valid=new{Type="Decimal", LenMax=15},Validity="require().match('number').greaterThanOrEqualTo(0)"},//8
            new { FName = "IsInjuredPersons",Valid=new{Type="boolean"}},//9
            new { FName = "InsurerClaimID",Valid=new{Type="AlphaNumSpace", LenMax=50},Validity="maxLength(50)"},//10
            new { FName = "ClaimStatus",Valid=new{Type="Integer", LenEqual=2},Validity="require().match('integer').maxLength(2).greaterThanOrEqualTo(0)"},//11
            new { FName = "AmountIsConfirmed",Valid=new{Type="boolean"}},//12
            new { FName = "Days",Valid=new{Type="Integer", LenMax=10},Validity="require().match('integer').maxLength(10).greaterThanOrEqualTo(0)"},//13
            new { FName = "PerDay",Valid=new{Type="Decimal", LenEqual=10},Validity="require().match('number').greaterThanOrEqualTo(0)"}//14
            }; JSON.Cols = Cols;
         JSON.Config = new {
            Controler = "Claims", tblUpdate = "tblClaims", Msg = new { AddNew = "Naujos þalos pridëjimas", Edit = "Þalos redagavimas", Delete = "Iðtrinti þalà", GenName = "Þala" }
         };
         JSON.Grid = new {
            aoColumns = new object[]{
            new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
            new {sTitle="Þalos tipas",bSearchable=false},//1//ClaimTypeID////DefaultUpdate=0
            new {bVisible=false,bSearchable=false},//2//AccidentID////DefaultUpdate=0
            new {sTitle="Polisas",bSearchable=false},//3//InsPolicyID////DefaultUpdate=0
            new {sTitle="Transporto priemonë",bSearchable=false},//4//VehicleID////DefaultUpdate=0
            new {sTitle="Nr"},//5//No//
            new {sTitle="Visiðkas praradimas"},//6//IsTotalLoss//
            new {sTitle="Planuojama þalos suma"},//7//LossAmount//
            new {sTitle="Planuojama draudimo iðmoka"},//8//InsuranceClaimAmount//
            new {sTitle="Ávykio metu suþaloti þmonës"},//9//IsInjuredPersons//
            new {sTitle="Þalos nr. draudiko sistemoje"},//10//InsurerClaimID////DefaultUpdate=0
            new {sTitle="Þalos bûklë"},//11//ClaimStatus//
            new {sTitle="Þalos suma patvirtinta"},//12//AmountIsConfirmed//
            new {sTitle="Prastova dienomis"},//13//Days//
            new {sTitle="Prastovos kaina per dienà"}//14//PerDay//
            }
         };