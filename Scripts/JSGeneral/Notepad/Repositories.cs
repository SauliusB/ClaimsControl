var opt=$.extend(this.options, $(input).data("ctrl"));

try
{
	// Some code that can cause an exception.

	throw new Exception("An error has happened");
}
catch (Exception ex)
{
	System.Diagnostics.StackTrace trace = new System.Diagnostics.StackTrace(ex, true);

	MessageBox.Show(trace.GetFrame(0).GetMethod().Name);
	MessageBox.Show("Line: " + trace.GetFrame(0).GetFileLineNumber());
	MessageBox.Show("Column: " + trace.GetFrame(0).GetFileColumnNumber());
}