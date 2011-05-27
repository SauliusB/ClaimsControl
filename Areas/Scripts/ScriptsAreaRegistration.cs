using System.Web.Mvc;

namespace CC.Areas.Scripts {
   public class ScriptsAreaRegistration : AreaRegistration {
      public override string AreaName {
         get {
            return "Scripts";
         }
      }

      public override void RegisterArea(AreaRegistrationContext context) {
         context.MapRoute(
             "Scripts_default",
             "Scripts/{controller}/{action}/{id}",
             new { action = "Index", id = UrlParameter.Optional }
         );
      }
   }
}
