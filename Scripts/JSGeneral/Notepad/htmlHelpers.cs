        public static MvcHtmlString checkbox(string id, bool Val, string Title, string UpdateField)
        {
            return MvcHtmlString.Create(String.Format(@"<input type='checkbox' id='{0}' {1} title='{2}' {4} data-ctrl='{{""Value"":""{3}""{5}}}'/>
                <label class='dialog-form-label label-forChk'   for='{0}'>{2}</label>", 
				id, (Val) ? "checked=true" : "", Title, (Val) ? 1 : 0, (UpdateField != "") ? "class='UpdateField'" : "", (UpdateField != "") ? ",\"UpdateField\":\"" + UpdateField + "\"" : ""));
        }                               //0          1                    2      3              4                                                   5
        public static MvcHtmlString textarea120(string id, string Val, string Title, string Tip, string Validity, string UpdateField)
        {
            if (Val == null) { Val = ""; }
            string DefT = (Val == "" && Tip != "") ? " defaultText" : string.Empty;//Kai Val nera o Tip yra sudedam viska
            //if (Val != "" && Tip != "") { DefT += " defaultText"; };//Kai yra ir Val ir Tip sudedam defaultText ir Tip

            return MvcHtmlString.Create(String.Format(@"<div><label for='{0}' class='dialog-form-label'>{2}</label></div>
                <textarea rows=2 cols=120 id='{0}' title='{2}' class='textarea ui-widget-content ui-corner-all {5} {6}'
                data-ctrl='{{""Tip"":""{3}"",""Validity"":""{4}"",""Value"":""{1}""{7}}}'>{1}</textarea>", id, Val, Title, Tip, Validity, DefT, (UpdateField != "") ? "UpdateField" : "", (UpdateField != "") ? ",\"UpdateField\":\"" + UpdateField + "\"" : ""));
            //0     1   2       3   4           5   6
        }
        public static MvcHtmlString text(string id, string Val, string Title, string Tip, string Validity, string Datatype, string UpdateField)
        {
            if (Val == null) { Val = ""; }
            string DefT = (Val == "" && Tip != "") ? " defaultText defaultTextActive" : string.Empty;//Kai Val nera o Tip yra sudedam viska
            if (Val != "" && Tip != "") { DefT += " defaultText"; };//Kai yra ir Val ir Tip sudedam defaultText ir Tip

            return MvcHtmlString.Create(String.Format(@"<div class='dialog-form-label'>{2}</div>
                <input type='text' id='{0}' title='{2}' class='text ui-widget-content ui-corner-all {5} {7}'
                data-ctrl='{{""Tip"":""{3}"",""Validity"":""{4}"",""Type"":""{6}"",""Value"":""{1}""{8}}}' value='{1}'/>", id, Val, Title, Tip, Validity, DefT, Datatype, (UpdateField != "") ? "UpdateField" : "", (UpdateField != "") ? ",\"UpdateField\":\"" + UpdateField + "\"" : ""));
                                                                                                                           //0    1    2      3    4       5       6        7                                       8
        }
        //@MyHTML.date("Date", @Model.Accident.Date, "Ávykio data ir laikas (vietos laiku)", "require().match('date').lessThanOrEqualTo(new Date())", true)

        public static MvcHtmlString date(string id, DateTime Val, string Title, Int32 Tip, string Validity, string UpdateField)
        {
            string ValStr = Val.ToShortDateString().Replace(".","-") + " / " + Val.ToShortTimeString().Substring(0, 5);
            return MvcHtmlString.Create(String.Format(@"<div class='dialog-form-label'>{2}</div>
            <input type='text' id='{0}' title='{2}' class='date ui-widget-content ui-corner-all {3} {5}' data-ctrl='{{""Tip"":""{1}"",""Validity"":""{4}"",""Type"":""date"",""Value"":""{1}""{6}}}' value='{1}'/>"
             , (id), ValStr, Title, (Tip == 1) ? "defaultText" : "", Validity, (UpdateField != "") ? "UpdateField" : "", (UpdateField != "") ? ",\"UpdateField\":\"" + UpdateField + "\"" : ""));
            //   0       1       2       3                                                4          5
            //"2010-10-01 / 14:22"
        }
        public static MvcHtmlString listbox(string id, Int32 Val, string Title, string Tip, string DataSource, string UpdateField)
        {
            //<div id='lst-lbl-tblAccidentsTypes' class='c' data-ctrl="{SelID:@Model.Accident.ID}">
            return MvcHtmlString.Create(String.Format(@"<div id='lst-lbl-{0}' class='dialog-form-label' data-ctrl='{{""Value"":{1},""Tip"":""{3}"",""DataSource"":""{4}""{5}}}'>{2}</div>",
                id, Val, Title, Tip, DataSource, (UpdateField != "") ? ",\"UpdateField\":\"" + UpdateField + "\"" : ""));
            //0      1   2       3     4     5



        }

