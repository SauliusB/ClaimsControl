using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Mvc;

namespace CC.Classes {

   public abstract class ToStringController : Controller {

      protected string RenderPartialViewToString() {
         return RenderPartialViewToString(null, null);
      }

      protected string RenderPartialViewToString(string viewName) {
         return RenderPartialViewToString(viewName, null);
      }

      protected string RenderPartialViewToString(object model) {
         return RenderPartialViewToString(null, model);
      }

      protected string RenderPartialViewToString(string viewName, object model) {
         if (string.IsNullOrEmpty(viewName))
            viewName = ControllerContext.RouteData.GetRequiredString("action");

         ViewData.Model = model;

         using (StringWriter sw = new StringWriter()) {
            ViewEngineResult viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
            ViewContext viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
            viewResult.View.Render(viewContext, sw);

            return sw.GetStringBuilder().ToString();
         }
      }
   }

   public class General {
   }

   #region Utils, Extensions

   internal static class Utils {
      private static Regex _isNumber = new Regex(@"^[-+]?[0-9]*\.?[0-9]+$");
      private static Regex _isInteger = new Regex(@"^\d+$");

      public static bool IsInteger(string theValue) {
         Match m = _isInteger.Match(theValue);
         return m.Success;
      }

      public static string EncodeJsString(string s) {
         StringBuilder sb = new StringBuilder();
         //sb.Append("\"");
         foreach (char c in s) {
            switch (c) {
               //case '\'':
               //    sb.Append("\\\""); break;
               case '\"':
                  sb.Append("\\\""); break;
               case '\\':
                  sb.Append("\\\\"); break;
               case '\b':
                  sb.Append("\\b"); break;
               case '\f':
                  sb.Append("\\f"); break;
               case '\n':
                  sb.Append("\\n"); break;
               case '\r':
                  sb.Append("\\r"); break;
               case '\t':
                  sb.Append("\\t"); break;
               default:
                  //int i = (int)c;  - pagaidina lietuviskas raides
                  //if (i < 32 || i > 127)
                  //{ sb.AppendFormat("\\u{0:X04}", i); }
                  //else
                        { sb.Append(c); }

                        break;
            }
         }
         //sb.Append("\"");
         return sb.ToString();
      }

      public static bool IsNumber(object theValue) {
         Match m = _isNumber.Match(theValue.ToString());
         return m.Success;
      }
   }

   public static class MyExtensions {

      public static bool In(this object o, IEnumerable<object> c) {
         foreach (object i in c) { if (i.Equals(o)) return true; }
         return false;
      }

      //Naudojamas Repositories.cs getJson
      public static List<T> ListOfType<T>(this T type) {
         return new List<T>();
      }

      //public static void AddItem<T>(this List<T> List, T obj)
      //{
      //    List.Add(obj);
      //}
      //public static string toJson(this IEnumerable<object> sequence)
      //{
      //    StringBuilder sb = new StringBuilder();
      //    foreach (var item in sequence)
      //    {
      //        sb.Append(item.toString());
      //    }
      //    return sb.ToString();
      //}
      public static IEnumerable<T> Where<T>(this IEnumerable<T> sequence, Predicate<T> predicate) {
         foreach (T item in sequence) {
            if (predicate(item)) {
               yield return item;
            }
         }
      }

      public static void ForEach<T>(this IEnumerable<T> list, Action<T> action) {
         foreach (var item in list) action(item);
      }

      #region Stringbuilder

      public static void AppendCollection<TItem>(this StringBuilder builder, IEnumerable<TItem> items, Func<TItem, string> valueSelector) {
         foreach (TItem item in items) { builder.Append(valueSelector(item)); }
      }

      public static void AppendCollection<TItem>(this StringBuilder builder, IEnumerable<TItem> items) { AppendCollection(builder, items, x => x.ToString()); }

      public static void AppendCollection1<TItem>(this StringBuilder builder, IEnumerable<TItem> items, Func<TItem, string> GetString) {
         foreach (TItem item in items) { builder.Append(GetString(item)); }
      }

      public static void AppendNodeCollection(this StringBuilder builder, IEnumerable<string> items, string NodeName) {
         builder.Append("<"); builder.Append(NodeName); builder.Append(">");
         foreach (string item in items) { builder.Append(item); }
         builder.Append("</"); builder.Append(NodeName); builder.Append(">");
      }

      //public static void AppendNodeCollectionFromDict(this StringBuilder builder, MyDictionary<string, string> items, string NodeName)
      //{
      //    builder.Append("<"); builder.Append(NodeName); builder.Append(" ");
      //    foreach (var item in items)
      //    { builder.Append(item.Key); builder.Append("=\""); builder.Append(item.Value); builder.Append("\""); }
      //    builder.Append("/>");
      //}

      public static void AppendNode(this StringBuilder builder, string item, string NodeName) {
         builder.Append("<"); builder.Append(NodeName); builder.Append(">");
         builder.Append(item);
         builder.Append("</"); builder.Append(NodeName); builder.Append(">");
      }

      #endregion Stringbuilder

      #region String

      public static bool IsEmpty(this string o) {
         if (o != null) { if (o.Length > 0) return false; }
         return true;
      }

      public static bool IsInteger(this string s) {
         Regex regex = new Regex(@"^\d+$");
         return regex.IsMatch(s);
      }

      public static bool IsDate(this string s) {
         try { System.DateTime.Parse(s); return true; }
         catch (Exception) { return false; }
      }

      public static bool IsValidEmailAddress(this string s) {
         Regex regex = new Regex(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
         return regex.IsMatch(s);
      }

      public static int toInt(this string s, int DefaultVal) {
         try { DefaultVal = Convert.ToInt32(s); }
         catch (Exception) { ;}
         return DefaultVal;
      }

      #endregion String
   }

   public static class FileHelper {

      public static StringBuilder GetBuilder(string FullFPath) {
         StringBuilder strB;
         StreamReader reader = new StreamReader(FullFPath);
         strB = new StringBuilder(reader.ReadToEnd());
         reader.Close();
         return strB;
      }

      public static string GetString(string FullFPath) {
         StreamReader reader = new StreamReader(FullFPath);
         string strB = reader.ReadToEnd();
         reader.Close();
         return strB;
      }

      public static void WriteStr(string Body, string NewFileFullFPath) {
         StreamWriter writer = new StreamWriter(NewFileFullFPath);
         writer.Write(Body);
         writer.Close();
      }

      public static void InsertXMLtoRoot(string BodyToAppend, string FileFullFPath) {
         string fileContents = "";
         if (!File.Exists(FileFullFPath)) { fileContents = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Log>" + BodyToAppend + "</Log>"; }
         else {
            using (TextReader reader = File.OpenText(FileFullFPath)) { fileContents = reader.ReadToEnd(); reader.Close(); }
            fileContents = System.Text.RegularExpressions.Regex.Replace(fileContents, "</Log>$", BodyToAppend + "</Log>");
         }
         using (TextWriter sw = File.CreateText(FileFullFPath)) { sw.Write(fileContents); sw.Close(); }
      }

      public static void WriteBuilder(StringBuilder StrB, string NewFileFullFPath) {
         StreamWriter writer = new StreamWriter(NewFileFullFPath);
         writer.Write(StrB.ToString());
         writer.Close();
      }
   }

   #endregion Utils, Extensions

   //namespace Microsoft.Web.Mvc
   //{
   //    public class JsonValueProviderFactory : ValueProviderFactory
   //    {
   //        private static void AddToBackingStore(Dictionary<string, object> backingStore, string prefix, object value)
   //        {
   //            {
   //                // dictionary?
   //                var d = value as IDictionary<string, object>;
   //                if (d != null)
   //                {
   //                    foreach (var entry in d)
   //                    {
   //                        AddToBackingStore(backingStore, MakePropertyKey(prefix, entry.Key), entry.Value);
   //                    }
   //                    return;
   //                }
   //            }

   //            {
   //                // list?
   //                var l = value as IList;
   //                if (l != null)
   //                {
   //                    for (int i = 0; i < l.Count; i++)
   //                    {
   //                        AddToBackingStore(backingStore, MakeArrayKey(prefix, i), l[i]);
   //                    }
   //                    return;
   //                }
   //            }

   //            // primitive
   //            backingStore[prefix] = value;
   //        }

   //        private static object GetDeserializedJson(ControllerContext controllerContext)
   //        {
   //            if (!controllerContext.HttpContext.Request.ContentType.StartsWith("application/json", StringComparison.OrdinalIgnoreCase))
   //            {
   //                // not JSON request
   //                return null;
   //            }

   //            var reader = new StreamReader(controllerContext.HttpContext.Request.InputStream);
   //            string bodyText = reader.ReadToEnd();
   //            if (String.IsNullOrEmpty(bodyText))
   //            {
   //                // no JSON data
   //                return null;
   //            }

   //            var serializer = new JavaScriptSerializer();
   //            object jsonData = serializer.DeserializeObject(bodyText);
   //            return jsonData;
   //        }

   //        public override IValueProvider GetValueProvider(ControllerContext controllerContext)
   //        {
   //            object jsonData = GetDeserializedJson(controllerContext);
   //            if (jsonData == null)
   //            {
   //                return null;
   //            }

   //            var backingStore = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
   //            AddToBackingStore(backingStore, String.Empty, jsonData);
   //            return new DictionaryValueProvider<object>(backingStore, CultureInfo.CurrentCulture);
   //        }

   //        private static string MakeArrayKey(string prefix, int index)
   //        {
   //            return prefix + "[" + index.ToString(CultureInfo.InvariantCulture) + "]";
   //        }

   //        private static string MakePropertyKey(string prefix, string propertyName)
   //        {
   //            return (String.IsNullOrEmpty(prefix)) ? propertyName : prefix + "." + propertyName;
   //        }
   //    }
   //}
}