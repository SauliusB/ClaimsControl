using System;
using System.Data;
using System.Data.SqlClient;
using CC.Classes;

namespace CC.Models {
   public interface IUpdate {

      jsonResponse AddNew(string[] Data, string[] Fields, string DataTable, string Ext);

      jsonResponse Edit(Int32 id, string Data, string Field, string DataTable, string Ext);

      jsonResponse Delete(Int32 id, string DataTable, string Ext);
   }

   public class Repositories_Update {
      private static string conStr = System.Configuration.ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ToString();

      //public Repositories_Update(){ }
      private string GetStringFromArrSpec(string[] Arr) {
         if (Arr == null) return "null";
         for (int i = 0; i < Arr.GetLength(0); i++) { if (Arr[i] == null) Arr[i] = "null"; }//Nes null jei bus ant join teliks null
         return string.Join("#|#", Arr);
      }

      private string GetStringFromArrComma(string[] Arr) { return string.Join(",", Arr); }

      public jsonResponse AddNew(string[] Data, string[] Fields, string DataObject, string Ext) {
         jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = "" };
         SqlConnection con = new SqlConnection(conStr);
         SqlCommand cmd = new SqlCommand("proc_Update_AddNew", con);
         cmd.CommandType = System.Data.CommandType.StoredProcedure;
         cmd.Parameters.AddWithValue("@TableName", DataObject.Trim());
         cmd.Parameters.AddWithValue("@Data", GetStringFromArrSpec(Data));//Spec duomenu delimiteris, nes ten kbl gali but
         cmd.Parameters.AddWithValue("@Fields", GetStringFromArrComma(Fields));

         SqlParameter Extout = cmd.Parameters.AddWithValue("@Ext", ((Ext == null) ? "" : Ext));
         Extout.SqlDbType = System.Data.SqlDbType.NVarChar;
         Extout.Size = -1;
         Extout.Direction = ParameterDirection.InputOutput;

         SqlParameter IDout = cmd.Parameters.AddWithValue("@ID", 0);
         IDout.Direction = ParameterDirection.InputOutput;

         cmd.Parameters.AddWithValue("@UserID", UserData.UserID);
         cmd.Parameters.AddWithValue("@AccountID", UserData.AccountID);

         try {
            con.Open(); cmd.ExecuteNonQuery(); Int32 ID = Convert.ToInt32(IDout.Value);
            JsonResp.ResponseMsg = new { ID = ID, Ext = ((Extout.Value != null) ? Convert.ToString(Extout.Value) : "") };
         }
         catch (Exception ex) { JsonResp.ErrorMsg = ex.Message; }
         finally { con.Close(); }
         return JsonResp;
      }

      public jsonResponse Edit(Int32 id, string[] Data, string[] Fields, string DataObject, string Ext) {
         jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = "" };
         SqlConnection con = new SqlConnection(conStr);
         SqlCommand cmd = new SqlCommand("proc_Update_Edit", con);
         cmd.CommandType = System.Data.CommandType.StoredProcedure;
         cmd.Parameters.AddWithValue("@TableName", DataObject.Trim());
         cmd.Parameters.AddWithValue("@Data", GetStringFromArrSpec(Data));
         cmd.Parameters.AddWithValue("@Fields", GetStringFromArrComma(Fields));
         cmd.Parameters.AddWithValue("@ID", id);
         cmd.Parameters.AddWithValue("@UserID", UserData.UserID);

         SqlParameter Extout = cmd.Parameters.AddWithValue("@Ext", ((Ext == null) ? "" : Ext));
         Extout.SqlDbType = System.Data.SqlDbType.NVarChar;
         Extout.Size = -1;
         Extout.Direction = ParameterDirection.InputOutput;

         cmd.Parameters.AddWithValue("@AccountID", UserData.AccountID);

         try {
            con.Open(); cmd.ExecuteNonQuery();
            if (Extout.Value != null) { JsonResp.ResponseMsg = new { Ext = ((Extout.Value != null) ? Convert.ToString(Extout.Value) : "") }; }
         }
         catch (Exception ex) { JsonResp.ErrorMsg = ex.Message; }
         finally { con.Close(); }
         return JsonResp;
      }

      public jsonResponse Delete(Int32 id, string DataObject, string Ext) {
         jsonResponse JsonResp = new jsonResponse { ErrorMsg = "", ResponseMsg = "" };
         SqlConnection con = new SqlConnection(conStr);
         SqlCommand cmd = new SqlCommand("proc_Update_Delete", con);
         cmd.CommandType = System.Data.CommandType.StoredProcedure;
         cmd.Parameters.AddWithValue("@TableName", DataObject.Trim());
         cmd.Parameters.AddWithValue("@ID", id);
         cmd.Parameters.AddWithValue("@UserID", UserData.UserID);

         SqlParameter Extout = cmd.Parameters.AddWithValue("@Ext", ((Ext == null) ? "" : Ext));
         Extout.SqlDbType = System.Data.SqlDbType.NVarChar;
         Extout.Size = -1;
         Extout.Direction = ParameterDirection.InputOutput;

         //SqlParameter SuccessMsg = cmd.Parameters.AddWithValue("@SuccessMsg", "");
         //SuccessMsg.SqlDbType = System.Data.SqlDbType.NVarChar;
         //SuccessMsg.Size = -1;
         //SuccessMsg.Direction = ParameterDirection.InputOutput;

         cmd.Parameters.AddWithValue("@AccountID", UserData.AccountID);

         try {
            con.Open(); cmd.ExecuteNonQuery(); { JsonResp.ResponseMsg = new { Ext = ((Extout.Value != null) ? Convert.ToString(Extout.Value) : "") }; }
            //con.Open(); cmd.ExecuteNonQuery(); { JsonResp.ResponseMsg = new { SuccessMsg = ((SuccessMsg.Value != null) ? Convert.ToString(SuccessMsg.Value) : ""), Ext = ((Extout.Value != null) ? Convert.ToString(Extout.Value) : "") }; }
         }
         catch (Exception ex) { JsonResp.ErrorMsg = ex.Message; }
         finally { con.Close(); }
         return JsonResp;
      }
   }
}