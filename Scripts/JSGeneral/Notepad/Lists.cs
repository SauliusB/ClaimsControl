      public jsonArrays GetJSON_tblVehicles(bool? OnlyTop) {
         jsonArrays JSON = new jsonArrays();
         JSON.Data = from d in dc.proc_Vehicles(UserData.AccountID, OnlyTop)
                     select new object[] {
				d.ID,//0
            d.Type,//1
				d.Plate,//2
				d.Make,//3
				d.Model,//4
				d.Year,//5
            d.Docs,//6
				d.EndDate,//7
				d.TypeID,//8
 				d.MakeID//9
            };
         object[] Cols ={
				new { FName = "ID"},//0
            new { FName = "Type",Type="String",IdInMe=8},//1
				new { FName = "Plate",Type="String", LenMax=10,IsUnique=new object[]{2},Validity="require().nonHtml().maxLength(10)"},//2
				new { FName = "Make",IdInMe=5},//3
				new { FName = "Model",Type="String", LenMax=30,Validity="require().nonHtml().maxLength(30)"},//4
				new { FName = "Year",Type="DateYearLess", LenEqual=4,Validity="require()"},//5
				new { FName = "Docs",Type="String",NotEditable=1},//6
				new { FName = "EndDate",Type="DateLess", LenMax=30,Validity="require().nonHtml().maxLength(30)"},//7
				new { FName = "TypeID",List=new{Source="tblVehicleTypes",Editable=0,ListType="List", Val=0,Text=new object []{1}}},//8
				new { FName = "MakeID",List=new{Source="tblVehicleMakes",Editable=1,ListType="List", Val=0,Text=new object []{1}}}//9
			}; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Vehicles", tblUpdate = "tblVehicles", Msg = new { AddNew = "Naujos transporto priemonës sukûrimas", Edit = "Transporto priemoniø redagavimas", Delete = "Iðtrinti transporoto priemonæ", GenName = "Transporto priemonë", GenNameWhat = "transporto priemonæ", ListName = "Transporto priemoniø sàraðas" } };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
					new {sTitle="Tipas"},//1//Plate//
					new {sTitle="Valst.Nr."},//1//Plate//
					new {sTitle="Markë"},//2//MakeID////DefaultUpdate=0
					new {sTitle="Modelis"},//3//Model//
					new {sTitle="Metai"},//4//Year//
					new {sTitle="Dokumentai"},//4//Year//
					new {sTitle="TipoID"},//4//Year//
					new {sTitle="MarkësID"}//4//Year//
				},
            //aaSorting = new object[] { new object[] { 1, "asc" } },//???
         };
         return JSON;
      }
	        public jsonArrays GetJSON_proc_InsPolicies(bool? OnlyTop) {
         jsonArrays JSON = new jsonArrays();
         JSON.Data = from p in dc.proc_InsPolicies(UserData.AccountID, OnlyTop)
                     select new object[] {
				p.ID,//0
            p.ClaimType,//1
            p.InsurerName,//2
            p.PolicyNumber,//3
				p.EndDate.ToShortDateString().Replace(".","-"),//4
				p.InsuredName,//5
				p.InsuredCode,//6
            p.InsuredAddress,//7
            p.InsuredContactName,//8
            p.InsuredContactID,//9
            p.ClaimTypeID,//10
				p.InsurerID//11
			};
         object[] Cols ={//NotEditable=true // Unique=true// LenMax/LenEqual/LenMin:10
				//Date,DateLess,DateNoLess,Time,String
				new { FName = "ID"},//0
            new { FName = "ClaimType",IdInMe=10},//2
				new { FName = "InsurerName",IdInMe=11},//3
				new { FName = "PolicyNumber",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//3

				new { FName = "EndDate",Type="DateMore", Default="Today",Validity="require().match('date').greaterThanOrEqualTo(new Date())"},//4
				new { FName = "InsuredName",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//5
				new { FName = "InsuredCode",Type="String", LenMax=50,Validity="require().nonHtml().maxLength(50)"},//6

				new { FName = "InsuredAddress",Type="String", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//7
				new { FName = "InsuredContactName",Type="String"},//8
            new { FName = "InsuredContactID",List=new{Source="tblUsers",Editable=1,ListType="List", Val=0,Text=new object []{1,2}}},//9
				new { FName = "ClaimTypeID",List=new{Source="tblClaimTypes",Editable=0,ListType="List", Val=0,Text=new object []{1}}},//10
				new { FName = "InsurerID",List=new{Source="tblInsurers",Editable=1,ListType="List", Val=0,Text=new object []{1}}},//11
                        }; JSON.Cols = Cols;
         JSON.Config = new { Controler = "InsPolicy", tblUpdate = "tblInsPolicy", Msg = new { AddNew = "Naujo draudimo poliso sukûrimas", Edit = "Draudimo poliso redagavimas", Delete = "Iðtrinti draudimo polisà", GenName = "Draudimo polisas", GenNameWhat = "draudimo polisà", ListName = "Draudimo polisø sàraðas" } };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
					new {sTitle="Draudimo rûðis"},//1//ClaimType//
					new {sTitle="Draudimo kompanija"},//2//InsurerName//
					new {sTitle="Poliso Nr."},//3//PolicyNumber//

					new {sTitle="Galiojimo data"},//4//EndDate//

					new {sTitle="Draudëjas"},//5//InsuredName////DefaultUpdate=0
					new {sTitle="Draudëjo kodas"},//6//InsuredName//
					new {sTitle="Draudëjo adresas"},//7//InsuredCode//
					new {sTitle="Draudëjo kontaktas"},//8//InsuredContact//
					new {bVisible=false,bSearchable=false,sTitle="Draudëjo kontakto ID"},//9//InsuredContactID////UserID
					new {bVisible=false,bSearchable=false,sTitle="Draudëjo tipo ID"},//10//ClaimTypeID////DefaultUpdate=0
					new {bVisible=false,bSearchable=false,sTitle="Draudëjo ID"}//11//InsurerID////
				}
            // aaSorting = new object[] { new object[] { 3, "asc" } },//???
         };
         return JSON;
      }
      public jsonArrays GetJSON_proc_Drivers(bool? OnlyTop) {
         jsonArrays JSON = new jsonArrays();
         //JSON.Data = from d in dc.tblDrivers
         // where d.IsDeleted == false && d.AccountID == UserData.AccountID
         JSON.Data = from d in dc.proc_Drivers(UserData.AccountID, OnlyTop)
                     select new object[] {
				d.ID,//0
				d.FirstName,//1
				d.LastName,//2
				d.DateExpierence,//3
				d.DrivingCategory,//4
				d.Phone,//5
            d.Docs,//6
				d.DateEnd,//7
			};
         object[] Cols ={
				new { FName = "ID"},//0
				new { FName = "FirstName",Type="String", LenMax=100,IsUnique=new object[]{1,2},Validity="require().nonHtml().maxLength(100)"},//1
				new { FName = "LastName",Type="String", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//2
				new { FName = "DateExpierence",Type="DateLess", Default="Today",Validity="require().match('date').lessThanOrEqualTo(new Date())"},//3
				new { FName = "DrivingCategory",Type="String", LenMax=20,Validity="require().nonHtml().maxLength(20)"},//4
				new { FName = "Phone",Type="Integer", LenMax=20,Validity="require().nonHtml().maxLength(20)"},//5
				new { FName = "Docs",Type="String"},//6
				new { FName = "DateEnd",Type="DateLess", Default="*",Validity="require().match('date').lessThanOrEqualTo(new Date())"},//7
			}; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Drivers", tblUpdate = "tblDrivers", Msg = new { AddNew = "Pridëti naujà vairuotojà", Edit = "Vairuotojo duomenø redagavimas", Delete = "Iðtrinti vairuotojà", GenName = "Vairuotojas", GenNameWhat = "vairuotojà", ListName = "Vairuotojø sàraðas" } };
         JSON.Grid = new {
            aoColumns = new object[]{
					new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
					new {sTitle="Vardas",sClass="smallFont"},//1//FirstName//
					new {sTitle="Pavardë",sClass="smallFont"},//2//LastName//
					new {sTitle="Darbo staþas nuo"},//3//DateExpierence//
					new {sTitle="Vairavimo kategorijos"},//4//DrivingCategory//
					new {sTitle="Telefonas"},//5//Phone//
					new {sTitle="Dokumentai"},//6//Docs//
					new {sTitle="Darbo pabaiga",bVisible=false,bSearchable=false},//7//DateEnd//
				}, //aaSorting = new object[] { new object[] { 2, "asc" } },//???
         };
         return JSON;
      }
