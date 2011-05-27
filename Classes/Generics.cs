using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CC.Models;
using System.Configuration;
namespace CC.Classes
{
    //var selected = specificObjects.ToSelectListItem(10, s => s.Id, s=> s.Name, s => s.Name, s => s.Id.ToString());
    public static class Generics
    {
        public static IEnumerable<SelectListItem> ToSelectListItem<T>(this IEnumerable<T> items,
        int selectedId, Func<T, int> getId, //Func<T, string> getName,
        Func<T, string> getText, Func<T, string> getValue)
        {
            return
                items.OrderBy(item => getId(item))//getName(item))
                //items.a
                .Select(item =>
                        new SelectListItem
                        {
                            Selected = (getId(item) == selectedId),
                            Text = getText(item),
                            Value = getValue(item)
                        });
        }
    //    public static IEnumerable<SelectListItem> ToSelectListItems<T>(
    // this IEnumerable<T> items,
    // Func<T, string> nameSelector,
    // Func<T, string> valueSelector,
    // Func<T, bool> selected)
    //    {
    //        return items.OrderBy(item => nameSelector(item))
    //               .Select(item =>
    //                       new SelectListItem
    //                       {
    //                           Selected = selected(item),
    //                           Text = nameSelector(item),
    //                           Value = valueSelector(item)
    //                       });
    //    }
    }
    //********************************Controler generics*************************************************************************************
    public class ControlerEdit<T_Rep, T_tbl> : Controller where T_Rep : IRepository_ControlerEdit<T_tbl>, new()
    {
        private T_Rep Repository;
        public ControlerEdit() : this(new T_Rep()) { }
        public ControlerEdit(T_Rep rep) { Repository = rep; }

        [HttpPost]
        public JsonResult Delete(Int32 id, string DataObject)
        { return Json(Repository.DeleteRow(id, DataObject)); }

        [HttpPost]
        public JsonResult EditField(string FieldName, Int32 id, string NewValue, string OldValue, string DataObject)
        { return Json(Repository.UpdateField(FieldName, id, NewValue, OldValue, DataObject)); }

        [HttpPost]
        public JsonResult AddNew(T_tbl Data, string DataObject)
        { return Json(Repository.AppendRow(Data, DataObject)); }
    }
    //Generic template for second alternative updatable tbl T_tbl2, method - AddNew2
    //Debuginant šitam nepasigauna
    public class ControlerEdit2<T_Rep, T_tbl, T_tbl2> : Controller where T_Rep : IRepository_ControlerEdit2<T_tbl, T_tbl2>, new()
    {
        private T_Rep Repository;
        public ControlerEdit2() : this(new T_Rep()) { }
        public ControlerEdit2(T_Rep rep) { Repository = rep; }
        [HttpPost]
        public JsonResult Delete(Int32 id, string DataObject)
        { return Json(Repository.DeleteRow(id, DataObject)); }

        [HttpPost]
        public JsonResult EditField(string FieldName, Int32 id, string NewValue, string OldValue, string DataObject)
        { return Json(Repository.UpdateField(FieldName, id, NewValue, OldValue, DataObject)); }

        [HttpPost]
        public JsonResult AddNew(T_tbl Data, string DataObject)
        { return Json(Repository.AppendRow(Data, DataObject)); }

        [HttpPost]
        public JsonResult AddNew2(T_tbl2 Data, string DataObject)
        { return Json(Repository.AppendRow2(Data, DataObject)); }
    }
    public interface IRepository_ControlerEdit<V>
    {
        jsonResponse UpdateField(string FieldName, Int32 id, string NewValue, string OldValue, string DataObject);
        jsonResponse DeleteRow(Int32 id, string DataObject);
        jsonResponse AppendRow(V Data, string DataObject);
    }
    public interface IRepository_ControlerEdit2<V, K>
    {
        jsonResponse UpdateField(string FieldName, Int32 id, string NewValue, string OldValue, string DataObject);
        jsonResponse DeleteRow(Int32 id, string DataObject);
        jsonResponse AppendRow(V Data, string DataObject);
        jsonResponse AppendRow2(K Data, string DataObject);
    }
    //********************************Repository generics*************************************************************************************
    //public class ControlerEdit<T_Rep, T_tbl> : Controller where T_Rep : IRepository_ControlerEdit<T_tbl>, new()

    public partial class RepositoryEdit<T_tbl> : IRepository_ControlerEdit<T_tbl>
        where T_tbl : class, Identifiable
    //string - Controler, T_tbl - lenteles tipas naudojamas AppendRow
    {
        private dbDataContext dc;
        public RepositoryEdit() { dc = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString); }

        public jsonResponse UpdateField(string FieldName, Int32 id, string NewValue, string OldValue, string DataObject)
        {
            string SQL; //objType=NewValue.GetType().Name;
            bool objIsNumber = Utils.IsNumber(NewValue);
            jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = new { ID = id, NewValue = NewValue, OldValue = OldValue } };
            //cia pakeiciam atitinkamai DataObject

            if (objIsNumber) { SQL = string.Format(@"UPDATE {0} SET {1}={2} WHERE ID={3}", DataObject, FieldName, NewValue, id); }
            else { SQL = string.Format(@"UPDATE {0} SET {1}='{2}' WHERE ID={3}", DataObject, FieldName, NewValue, id); }
            //// UpdVal = Convert.ToDateTime(NewValue);////UpdVal = Convert.ToInt32(NewValue);
            try { dc.ExecuteCommand(SQL); dc.SubmitChanges(); }
            catch (Exception ex) { JsonResp.ErrorMsg = ex.Message; }
            return JsonResp;
        }
        public jsonResponse DeleteRow(Int32 id, string DataObject)
        {
            jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = id };
            try
            {
                dc.ExecuteCommand(string.Format(@"DELETE FROM {0} WHERE id={1}", DataObject, id));
                dc.SubmitChanges();
            }
            catch (Exception ex) { JsonResp.ErrorMsg = ex.Message; }
            return JsonResp;
        }
        public jsonResponse AppendRow(T_tbl Data, string DataObject)
        {
            jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = "" };
            try
            {
                dc.GetTable<T_tbl>().InsertOnSubmit(Data); dc.SubmitChanges();
                //dc.tblClients.InsertOnSubmit(Data);dc.SubmitChanges();
                JsonResp.ResponseMsg = Data.ID.ToString();
            }
            catch (Exception ex) { JsonResp.ErrorMsg = ex.Message; }
            return JsonResp;
        }
    }
    public interface Identifiable
    //Kad galetum panaudot Data.ID
    //Tos tbl modelyje bs turi turet sita interfeisa: public partial class tblClients_Object: Identifiable
    { Int32 ID { get; } }

}

