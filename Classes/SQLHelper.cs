using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Collections;

namespace CC.SQLHelper
{
    public static class SQLHelper
    {
        //StoredProcedureCollection spCollection = new StoredProcedureCollection();
        //StoredProcedure spData = new StoredProcedure();
        //spData.ProcName="TestMe";
        //spData.SetParam("@CountryCode",SqlDbType.Int,1);
        //spData.SetParam("@City",SqlDbType.VarChar, Hyderabad );
        //spCollection.add(spProcedure);
        public static bool ExecuteSps(StoredProcedureCollection spCollection, SqlConnection Connection)
        {
            try
            {
                foreach (StoredProcedure spData in spCollection)
                {
                    SqlCommand cmd = new SqlCommand();
                    int i = 0;
                    if (Connection.State != ConnectionState.Open)
                        Connection.Open();
                    cmd.Connection = Connection;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = spData.ProcName;
                    IEnumerator myEnumerator = spData.GetParams().GetEnumerator();
                    while (myEnumerator.MoveNext())
                    {
                        ParamData pData = (ParamData)myEnumerator.Current;
                        cmd.Parameters.Add(pData.pName, pData.pDataType);
                        cmd.Parameters[i].Value = pData.pValue;
                        i = i + 1;
                    }
                    cmd.ExecuteNonQuery();
                }
                return true;

            }
            catch
            {
                return false;
            }
        }
    }
    public struct ParamData
    {
        public string pName, pValue;
        public SqlDbType pDataType;
        public ParamData(string pName, SqlDbType pDataType, string pValue)
        {
            this.pName = pName;
            this.pDataType = pDataType;
            this.pValue = pValue;
        }
    }
    public class StoredProcedure
    {
        private string sProcName;
        private ArrayList sParams = new ArrayList();
        public void SetParam(string pName, SqlDbType pDataType, string pValue)
        {
            ParamData pData = new ParamData(pName, pDataType, pValue);
            sParams.Add(pData);
        }

        public ArrayList GetParams()
        {
            if (!(sParams == null)) { return sParams; }
            else { return null; }
        }
        public string ProcName
        {
            get { return sProcName; }
            set { sProcName = value; }
        }
    }
    public class StoredProcedureCollection : System.Collections.CollectionBase
    {
        public void add(StoredProcedure value)
        { List.Add(value); }

        public void Remove(int index)
        {
            if (index > Count - 1 || index < 0)
            { Console.WriteLine("No data to remove"); }//ignore
            else { List.RemoveAt(index); }
        }
        public StoredProcedure Item(int Index)
        {
            return (StoredProcedure)List[Index];
        }
    }
    //------------------------------------------------------------------------------------------------------------------------------------
    //public class ControlsInMenu
    //{
    //    public ControlsInMenu() { ;}
    //    public Int32 MenuID { get; set; }
    //    public Int32 ControlID { get; set; }
    //}
    public static class Readers
    {
        public static string conStr = System.Configuration.ConfigurationManager.ConnectionStrings["CCConnectionString"].ToString();



        //public static object GetControlsInMenu(Int32 TabID)
        //{
        //    List<Int32[]> CinMenu = new List<Int32[]>();
        //    using (SqlConnection con = new SqlConnection(conStr))
        //    {
        //        SqlCommand cmd = new SqlCommand("proc_Action_ControlsInMenu", con);
        //        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //        cmd.Parameters.AddWithValue("@LoginID", LoginData.LoginID);
        //        cmd.Parameters.AddWithValue("@TabID", TabID);
        //        con.Open();
        //        using (SqlDataReader dr = cmd.ExecuteReader())
        //        {
        //            while (dr.Read())
        //            {
        //                Int32[] arr = new Int32[2];
        //                arr[0] = dr.GetInt32(0);
        //                arr[1] = dr.GetInt32(1);
        //                CinMenu.Add(arr);
        //            }
        //        }
        //    }
        //    return CinMenu;
        //}
    }
}