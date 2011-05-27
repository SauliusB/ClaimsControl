using System.Configuration;
using System.Linq;
using CC.Classes;

namespace CC.Models {

   public class clsDriver {

      public clsDriver(int? id) {
         if (id.HasValue) {
            NewRec = 0;
            Repositories_Lists ListRep = new Repositories_Lists();
            Driver = ListRep.Get_tblDriver(id.Value);
         }
         else { Driver = null; NewRec = 1; }
      }

      public tblDriver Driver { get; set; }

      public int NewRec { get; set; }
   }

   public class clsVehicle {

      public clsVehicle(int? id) {
         if (id.HasValue) {
            NewRec = 0;
            Repositories_Lists ListRep = new Repositories_Lists();
            Vehicle = ListRep.Get_tblVehicle(id.Value);
         }
         else { Vehicle = null; NewRec = 1; }
      }

      public tblVehicle Vehicle { get; set; }

      public int NewRec { get; set; }
   }

   public class clsInsPolicy {

      public clsInsPolicy(int? id) {
         if (id.HasValue) {
            NewRec = 0;
            Repositories_Lists ListRep = new Repositories_Lists();
            InsPolicy = ListRep.Get_tblInsPolicy(id.Value);
            //DocTypes = ListRep.Get_tblDocTypes();
            //DocGroups = ListRep.Get_tblDocGroups();
         }
         else { InsPolicy = null; NewRec = 1; }
      }

      public tblInsPolicy InsPolicy { get; set; }

      public IQueryable<tblDocType> DocTypes { get; set; }

      public IQueryable<tblDocGroup> DocGroups { get; set; }

      public IQueryable<tblWarning> Warnings { get; set; }

      public int NewRec { get; set; }
   }

   public class Repositories_Lists {
      private dbDataContext dc;

      public Repositories_Lists() { dc = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString); }

      public tblDriver Get_tblDriver(int id) {
         return (from d in dc.tblDrivers
                 where d.ID == id && d.IsDeleted == false
                 select d).SingleOrDefault() ?? null;
      }

      public tblVehicle Get_tblVehicle(int id) {
         return (from d in dc.tblVehicles
                 where d.ID == id && d.IsDeleted == false
                 select d).SingleOrDefault() ?? null;
      }

      public tblInsPolicy Get_tblInsPolicy(int id) {
         return (from d in dc.tblInsPolicies
                 where d.ID == id && d.IsDeleted == false
                 select d).SingleOrDefault() ?? null;
      }

      public object Get_ItemData(string tbl, int ID) {
         object obj = "";
         if (tbl == "tblInsPolicies") {
            var tblInsPolicy1 = from d in dc.tblInsPolicies where d.ID == ID && d.IsDeleted == false
                                select new object[] {
         d.ID,//0
         d.Warn_InfoAfterAcc,//1
         d.Warn_PaymentAfterPapers,//2
         d.Warn_SystemOfAccTerm,
         d.Warn_SystemOfPayTerm
         };
            var tblInsPolicyDocTypes = from d in dc.tblDocTypes join dINp in dc.tblInsPolicyDocs on d.ID equals dINp.DocTypeID
                                       join p in dc.tblInsPolicies on dINp.InsPolicyID equals p.ID where p.ID == ID && d.IsDeleted == false && d.AccountID == UserData.AccountID
                                       select new object[] {
         d.ID,//0
         };
            var tblWarnings = from w in dc.tblWarnings where w.InsPolicyID == ID && w.IsDeleted == false
                              select new object[] {
         w.ID,//0
         w.WarningEventID,//1
         w.Emails,//2
         w.Term
         };
            obj = new { tblInsPolicy1 = tblInsPolicy1, tblInsPolicyDocTypes = tblInsPolicyDocTypes, tblWarnings = tblWarnings };
         }
         return obj;
      }

      public IQueryable<tblDocType> Get_tblDocTypes() {
         return (from d in dc.tblDocTypes
                 where d.AccountID == UserData.AccountID && d.IsDeleted == false
                 select d).AsQueryable();
      }

      public IQueryable<tblDocGroup> Get_tblDocGroups() {
         return (from d in dc.tblDocGroups
                 where d.IsDeleted == false
                 select d).AsQueryable();
      }

      public IQueryable<tblWarning> Get_tblWarnings(int InsPolicyID) {
         return (from d in dc.tblWarnings
                 where d.IsDeleted == false && d.InsPolicyID == InsPolicyID
                 select d).AsQueryable();
      }

      public jsonArrays GetJSON_tblDocs() {
         jsonArrays JSON = new jsonArrays();
         JSON.Data = from d in dc.tblDocs
                     where d.IsDeleted == false && d.tblUser.ID == UserData.UserID
                     select new object[] {
            d.ID,//0
            d.DocName,//1
            d.FileName,//2
            d.FileType,//3
            d.FileDate,//4
            d.FileSize,//5
            d.UserID,//6
            d.DocTypeID,//7
            d.RefID,//8
            d.SortNo//9
            };
         object[] Cols ={
            new { FName = "ID"},//0
            new { FName = "DocName",Type="string"},//1
            new { FName = "FileName",Type="string"},//2
            new { FName = "FileType",Type="string"},//3
            new { FName = "FileDate",Type="Date"},//4
            new { FName = "FileSize",Type="Integer"},//5
            new { FName = "UserID"},//6
            new { FName = "DocTypeID"},//7
            new { FName = "RefID"},//8
            new { FName = "SortNo",Type="Integer"}//9
            }; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Lists", tblUpdate = "tblDocs" };
         //         JSON.Grid = new {
         //            aoColumns = new object[]{
         //new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
         //new {sTitle="DocName",sClass="smallFont"},//1//DocName//
         //new {sTitle="FileName",sClass="smallFont"},//2//FileName//
         //new {sTitle="FileType"},//3//FileType//
         //new {sTitle="FileDate"},//4//FileDate//
         //new {sTitle="FileSize"},//5//FileSize//
         //new {bVisible=false,bSearchable=false},//6//UserID////DefaultUpdate=0
         //new {bVisible=false,bSearchable=false},//7//DocTypeID////DefaultUpdate=0
         //new {bVisible=false,bSearchable=false},//8//RefID////DefaultUpdate=0
         //new {sTitle="SortNo"}//9//SortNo//
         //}, aaSorting = new object[] { new object[] { 3, "asc" } },//???
         //         };
         return JSON;
      }

      public jsonArrays GetJSON_tblDocType() {
         jsonArrays JSON = new jsonArrays();
         JSON.Data = from d in dc.tblDocTypes where d.IsDeleted == false && d.AccountID == UserData.AccountID
                     select new object[] {
         d.ID,//0
         d.Name,//1
         d.DocGroupID//2
         };
         object[] Cols ={
         new { FName = "ID"},//0
         new { FName = "Name",Type="string", LenMax=100,Validity="require().nonHtml().maxLength(100)"},//1
         new { FName = "DocGroupID",List=new{Source="tblDocGroup",Val=0,Text=new object[]{1}}}//2
         }; JSON.Cols = Cols;
         JSON.Config = new { Controler = "Lists", tblUpdate = "tblDocType" };
         JSON.Grid = new {
            aoColumns = new object[]{
            new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
            new {sTitle="Pavadinimas",sClass="smallFont"},//1//Name//
            new {bVisible=false,bSearchable=false}//2//DocGroupID////DefaultUpdate=0
            }
         };
         return JSON;
      }

      public jsonArrays GetJSON_tblDocGroup() {
         jsonArrays JSON = new jsonArrays();
         //JSON.Data = from c in dc.proc_Clients(LoginData.LoginID, null)
         //join a in dc.tblAccidents on d.AccidentID equals a.ID
         //
         JSON.Data = from d in dc.tblDocGroups
                     join t in dc.tblDocTypes on d.ID equals t.DocGroupID
                     where d.IsDeleted == false && t.AccountID == UserData.AccountID
                     select new object[] {
         d.ID,//0
         d.Name//1
         };
         object[] Cols ={
            new { FName = "ID"},//0
            new { FName = "Name",Type="string", LenMax=100,Validity="require().nonHtml().maxLength(100)"}//1
         }; JSON.Cols = Cols;
         JSON.Config = new {
            Controler = "Lists", tblUpdate = "tblDocGroup"
         };
         JSON.Grid = new {
            aoColumns = new object[]{
            new {bVisible=false,bSearchable=false},//0//ID////DefaultUpdate=0
            new {sTitle="Vardas"}//1//Name//
            }
         };
         return JSON;
      }
   }
}