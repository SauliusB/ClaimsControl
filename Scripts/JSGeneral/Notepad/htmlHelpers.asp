            return MvcHtmlString.Create(String.Format(@"<input type='checkbox' id='{0}' {1} title='{2}' {4} data-ctrl='{{""Value"":""{3}""{5}}}'/>
                <label class='dialog-form-label label-forChk'
                for='{0}'>{2}</label>", id, (Val) ? "checked=true" : "", Title, (Val) ? 1 : 0, (UpdateField != "") ? "class='UpdateField'" : "", (UpdateField != "") ? ",\"UpdateField\":\"" + UpdateField + "\"" : ""));
