function getMismatch(id) {
   $.getJSON("Main.aspx?Callback=GetMismatch",
        { MismatchId: id },
        function (result) {
           $("#AuthMerchId").text(result.AuthorizationMerchantId);
           $("#SttlMerchId").text(result.SettlementMerchantId);
           $("#CreateDate").text(formatJSONDate(Date(result.AppendDts)));
           $("#ExpireDate").text(formatJSONDate(Date(result.ExpiresDts)));
           $("#LastUpdate").text(formatJSONDate(Date(result.LastUpdateDts)));
           $("#LastUpdatedBy").text(result.LastUpdateNt);
           $("#ProcessIn").text(result.ProcessIn);
        }
        );
   return false;
}

function formatJSONDate(jsonDate) {
   var newDate=dateFormat(jsonDate, "mm/dd/yyyy");
   return newDate;

}