using System.Web.Mvc;
using CC.Classes;
using CC.Models;

namespace CC.Controllers {

   public class ListsController : ToStringController {

      [HttpPost]
      public JsonResult GetListItem(int? id, string tbl, bool GetAll)//GetAccidentLists()//Naudoja AccidentsCard
      {
         /// <summary>
         /// Siuncia Json objektus kiekvienam lenteles list itemsui.
         /// <para>Tusti objektai ("") ignoruojami<see cref="System.Console.WriteLine(System.String)"/></para>
         /// <para>Render = new { div = View } - renderina View i #div ir jei ten yra div.inputForm pravaro ją per js UpdatableForm metoda,
         ///  taip prideda controlsus pagal markupa arba jsona kuris nurodomas tam div.inputForm kaip Source</para>
         /// <para>ExecFn = new { tabAccidents = "tabs" } - pravaro jQuery pluginus ant kontrolsu</para>
         /// </summary>

         Repositories_Lists ListRep = new Repositories_Lists();
         string View = ""; object obj;
         if (tbl == "tblDrivers") {
            clsDriver d = new clsDriver(id);
            View = RenderPartialViewToString(tbl, d);//"tblDriver"
         }
         else if (tbl == "tblVehicles") {
            clsVehicle d = new clsVehicle(id);
            View = RenderPartialViewToString(tbl, d);//"tblVehicles"
         }
         else if (tbl == "tblInsPolicies") {
            clsInsPolicy d = new clsInsPolicy(id);
            View = RenderPartialViewToString(tbl, d);//"tblInsPolicies"
         }

         if (GetAll) {
            Repositories_Accidents AccRep = new Repositories_Accidents();
            obj = new {
               //tbl pirmi, Render - antras, ExecFn - paskutinis
               ItemData = ListRep.Get_ItemData(tbl, (id.HasValue) ? id.Value : 0),
               tblDocs = ListRep.GetJSON_tblDocs(),
               tblDocType = ListRep.GetJSON_tblDocType(),
               tblDocGroup = ListRep.GetJSON_tblDocGroup(),
               tblVehicleTypes = AccRep.GetJSON_tblVehicleTypes(),
               tblVehicleMakes = AccRep.GetJSON_tblVehicleMakes(),
               tblInsurers = AccRep.GetJSON_tblInsurers(),
               Render = new { divEditableForm = View }//,
               //ExecFn = new { tabAccidents = "tabs" }
            };
         }
         else { obj = new { Render = new { divEditableForm = View } }; }
         return Json(obj);
      }
   }
}