using System.Web.Mvc;
using CC.Classes;
using CC.Models;

namespace CC.Controllers {

   public class AccidentController : ToStringController {

      //[HttpPost]
      //public ActionResult Accident(int? id) {
      //   clsAccident a = new clsAccident(id);
      //   return View(a);
      //}
      //RenderPartialViewToString(“~/Path/To/View.aspx”)
      [HttpPost]
      public JsonResult GetAccident(int? AccidentNo)//GetAccidentLists()//Naudoja AccidentsCard
      {
         Repositories_Accidents AccRep = new Repositories_Accidents();
         string View = ""; int AccNo = (AccidentNo.HasValue) ? AccidentNo.Value : 0;
         clsAccident a = new clsAccident(AccNo);
         View = RenderPartialViewToString("Card", a);
         //if (AccidentNo == 0) { }//new { NewRec = NewRec }
         //else {
         //   View = RenderPartialViewToString("Card", a);
         //}
         return Json(new {
            //Render - pirmas, ExecFn - paskutinis
            Render = new { tabAccidents = View },
            tblAccidentsTypes = AccRep.GetJSON_tblAccidentTypes(),
            proc_Drivers = AccRep.GetJSON_proc_Drivers(false),
            ExecFn = new { tabAccidents = "tabs" }
         });
      }

      [HttpPost]
      public JsonResult AccidentsList() {
         Repositories_Accidents acc = new Repositories_Accidents();
         return Json(new {
            proc_Accidents = acc.GetJSON_proc_Accidents(),
         });
      }
   }
}