using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CC.Models;
using System.Configuration;

namespace CC.Classes
{

    public static class UserData
    {
        public static void CheckIt()
        {
            if (HttpContext.Current.Session["UserData_LoginName"] != null) return;
            else SetParameters();
        }
        public static void SetParameters()
        {
            //CC.Providers.CCMemProvider CCP = new CC.Providers.CCMemProvider();
            using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
            {
                var u= (from l in db.tblUsers
                        where l.Email == HttpContext.Current.User.Identity.Name
                        select l).Single();
                var a = (from aa in db.tblAccounts where aa.ID == u.AccountID select aa.Name).Single();
            SetParameters(u,a.ToString());
            }

        }
        public static void SetParameters(tblUser U, string account)
        {
            UserName = U.FirstName+" "+U.Surname;
            UserID = U.ID;
            Roles_GroupID = U.RoleGroupID;
            Email = U.Email;
            Account = account;
            AccountID = U.AccountID;
        }
        public static string UserName
        {
            get { CheckIt(); return (string)HttpContext.Current.Session["UserData_UserName"]; }
            set { HttpContext.Current.Session["UserData_UserName"] = value; }
        }
        public static Int32 AccountID
        {
            get { CheckIt(); return (Int32)HttpContext.Current.Session["UserData_AccountID"]; }
            set { HttpContext.Current.Session["UserData_AccountID"] = value; }
        }
        public static string Account
        {
            get { CheckIt(); return (string)HttpContext.Current.Session["UserData_Account"]; }
            set { HttpContext.Current.Session["UserData_Account"] = value; }
        }
        public static Int32 UserID
        {
            get { CheckIt(); return (Int32)HttpContext.Current.Session["UserData_UserID"]; }
            set { HttpContext.Current.Session["UserData_UserID"] = value; }
        }
        public static Int32 Roles_GroupID
        {
            get { CheckIt(); return (Int32)HttpContext.Current.Session["UserData_Roles_GroupID"]; }
            set { HttpContext.Current.Session["UserData_Roles_GroupID"] = value; }
        }
        public static string Email
        {
            get { CheckIt(); return (string)HttpContext.Current.Session["UserData_Email"]; }
            set { HttpContext.Current.Session["UserData_Email"] = value; }
        }

    }
}