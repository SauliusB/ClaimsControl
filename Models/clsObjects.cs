namespace CC.Models {

   public class jsonArrays {
      private object[] _Cols;
      private object _Config = 0;
      private object _Grid;
      private object _Data;

      public object[] Cols { get { return _Cols; } set { _Cols = value; } }

      public object Config { get { return _Config; } set { _Config = value; } }

      public object Grid { get { return _Grid; } set { _Grid = value; } }

      public object Data { get { return _Data; } set { _Data = value; } }

      //public List<string[]> Data { get { return _Data; } }
      //private List<string[]> _Data = new List<string[]>();
   }

   public class clsFilter {

      public string ColName { get; set; }

      public object ColValue { get; set; }
   }

   public class jsonResponse {

      public string ErrorMsg { get; set; }

      public object ResponseMsg { get; set; }
   }

   public class jsonResponse_Head {

      public jsonResponse_Head() { ErrorMsg = ""; Head = new HeadDetails(); Grid = new jsonArrays(); }

      public string ErrorMsg { get; set; }

      public HeadDetails Head { get; set; }

      public jsonArrays Grid { get; set; }
   }

   public class HeadDetails {

      public HeadDetails() { ;}

      public string HeadTemplate { get; set; }

      public int[] HeadColsFromGrid { get; set; }
   }

   public enum Valid_Type {
      Integer = 0,
      Decimal = 1,
      Date = 2,
      DateNotMore = 3,
      DateNotLess = 4,
      Time = 5,
      EMail = 6,
      String = 7,
   }

   public enum Valid_Len_IntNo {
      LenMax = 1,
      LenMin = 2,
      LenEqual = 3
   }

   public enum Valid_Etc_bool {
      Req = 1,
      Unique = 2,
      NotEditable = 3
   }
}