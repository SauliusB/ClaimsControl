using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CC.Models;

namespace CC.Controllers
{
    public class UpdateController : Controller
    {        
        [HttpPost]
        public JsonResult Add(string[] Data, string[] Fields, string DataTable, string Ext)
        {
            Repositories_Update UpdateRep = new Repositories_Update();
            return Json(UpdateRep.AddNew(Data, Fields, DataTable, Ext));
        }

        [HttpPost]
        public JsonResult Edit(Int32 id, string[] Data, string[] Fields, string DataTable, string Ext)
        {
            Repositories_Update UpdateRep = new Repositories_Update();
            return Json(UpdateRep.Edit(id, Data, Fields, DataTable, Ext));
        }

        [HttpPost]
        public JsonResult Delete(Int32 id, string DataTable, string Ext)
        {
            Repositories_Update UpdateRep = new Repositories_Update();
            return Json(UpdateRep.Delete(id, DataTable, Ext));
        }
    }
}
