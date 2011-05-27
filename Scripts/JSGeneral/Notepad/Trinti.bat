+		_Data	{SELECT [t0].[ID], [t0].[ClaimTypeID], [t0].[AccidentID], [t0].[InsPolicyID], [t0].[VehicleID], [t0].[No], [t0].[IsTotalLoss], [t0].[LossAmount],
 [t0].[InsuranceClaimAmount], [t0].[IsInjuredPersons], [t0].[InsurerClaimID], [t0].[ClaimStatus], [t0].[AmountIsConfirmed], [t0].[Days], [t0].[PerDay]
FROM [dbo].[tblClaims] AS [t0]
INNER JOIN [dbo].[tblAccidents] AS [t1] ON [t0].[AccidentID] = [t1].[ID]
WHERE (NOT ([t0].[IsDeleted] = 1)) AND ([t1].[AccountID] = @p0)
}	object {System.Data.Linq.DataQuery<object[]>}


