using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Web.Security;
using System.Web.Configuration;
using System.Security.Cryptography;
using System.Configuration;
using System.Configuration.Provider;
using System.Text;
using CC.Models;

namespace CC.Providers
{
    public class CCMemProvider : MembershipProvider//sealed
    {
        private MachineKeySection machineKey;

        #region General settings
        /*************************************************************************
         * General settings
         *************************************************************************/
        private string _applicationName;
        public override string ApplicationName
        {
            get { return _applicationName; }
            set { _applicationName = value; }
        }

        private bool _requiresUniqeEmail;
        public override bool RequiresUniqueEmail
        {
            get { return _requiresUniqeEmail; }
        }

        #endregion

        #region Private settings
        /*************************************************************************
         * Private settings
         *************************************************************************/

        private string _providerName;
        public string ProviderName
        {
            get { return _providerName; }
        }

        private TimeSpan _userIsOnlineTimeWindow;
        public TimeSpan UserIsOnlineTimeWindow
        {
            get { return _userIsOnlineTimeWindow; }
        }
        #endregion

        #region Password settings
        /*************************************************************************
         * Password settings
         *************************************************************************/

        private int _minRequiredNonAlphanumericCharacters;
        public override int MinRequiredNonAlphanumericCharacters
        {
            get { return _minRequiredNonAlphanumericCharacters; }
        }

        private int _minRequiredPasswordLength;
        public override int MinRequiredPasswordLength
        {
            get { return _minRequiredPasswordLength; }
        }

        private bool _enablePasswordReset;
        public override bool EnablePasswordReset
        {
            get { return _enablePasswordReset; }
        }

        private bool _enablePasswordRetrieval;
        public override bool EnablePasswordRetrieval
        {
            get { return _enablePasswordRetrieval; }
        }

        private int _passwordAttemptWindow;
        public override int PasswordAttemptWindow
        {
            get { return _passwordAttemptWindow; }
        }

        private string _passwordStrengthRegularExpression;
        public override string PasswordStrengthRegularExpression
        {
            get { return _passwordStrengthRegularExpression; }
        }

        private MembershipPasswordFormat _passwordFormat;
        public override MembershipPasswordFormat PasswordFormat
        {
            get { return _passwordFormat; }
        }

        private int _maxInvalidPasswordAttempts;
        public override int MaxInvalidPasswordAttempts
        {
            get { return _maxInvalidPasswordAttempts; }
        }

        private bool _requiresQuestionAndAnswer;
        public override bool RequiresQuestionAndAnswer
        {
            get { return _requiresQuestionAndAnswer; }
        }
        #endregion

        #region User related methods : create, update, unlock, delete methods.
        /*************************************************************************
		          User related methods : create, update, unlock, delete methods.
         *************************************************************************/
        public override MembershipUser CreateUser(string username, string password, string email, string passwordQuestion, string passwordAnswer, bool isApproved, object providerUserKey, out MembershipCreateStatus status)
        {
            //Tam kad veiktu reikia pridet userioID ir RoleGroupID
            ValidatePasswordEventArgs args = new ValidatePasswordEventArgs(email, password, true);
            OnValidatingPassword(args);
            if (args.Cancel)
            {
                status = MembershipCreateStatus.InvalidPassword;
                return null;
            }

            if (RequiresUniqueEmail && GetUserNameByEmail(email) != "")
            {
                status = MembershipCreateStatus.DuplicateEmail;
                return null;
            }

            // If no user with this name already exists
            if (GetUser(email, false) == null)
            {
                DateTime createdDate = DateTime.Now;
                tblUser U = new tblUser();
                U.FirstName = username;
                U.Password = EncodePassword(password);
                U.Email = email;

                // Set the password retrieval question and answer if they are required
                if (RequiresQuestionAndAnswer)
                {
                    U.PasswordQuestion = passwordQuestion;
                    U.PasswordAnswer = EncodePassword(passwordAnswer);
                }

                U.IsApproved = isApproved;
                U.IsLockedOut = false;
                U.Comment = "";
                U.CreatedDate = createdDate;
                U.LastLockOutDate = createdDate;
                U.LastLoginDate = createdDate;
                U.LastPasswordChangedDate = createdDate;
                U.FailedPasswordAttemptCount = 0;
                U.FailedPasswordAttemptCount = 0;
                try
                {
                    using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                    {
                        // Add the new user to the database
                        db.tblUsers.InsertOnSubmit(U);

                        // Add the user to a the signup group
                        // See the blog post for more details :
                        // http://eksith.wordpress.com/2010/04/04/linq-to-sql-usership
                        //Group g = (from groups in db.Groups
                        //           where groups.Signup == true
                        //           select groups).Single();

                        //if (g != null)
                        //{
                        //    usersInGroup mg = new usersInGroup();
                        //    mg.Group = g;
                        //    mg.Member = m;
                        //    db.tblUsersInGroups.InsertOnSubmit(mg);
                        //}

                        // Save changes
                        db.SubmitChanges();
                    }

                    // User creation was a success
                    status = MembershipCreateStatus.Success;

                    // Return the newly craeted user
                    return GetUserFromMember(U);
                }
                catch 
                {
                    // Something was wrong and the user was rejected
                    status = MembershipCreateStatus.UserRejected;
                }
            }
            else
            {
                // There is already a user with this name
                status = MembershipCreateStatus.DuplicateUserName;
            }

            // Something went wrong if we got this far without some sort of status or retun
            if (status != MembershipCreateStatus.UserRejected && status != MembershipCreateStatus.DuplicateUserName)
                status = MembershipCreateStatus.ProviderError;

            return null;
        }
        public override void UpdateUser(MembershipUser user)
        {
            using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
            {
                tblUser U = (from u in db.tblUsers where u.Email == user.Email select u).Single();
                U.Comment = user.Comment;
                U.Email = user.Email;
                U.IsApproved = user.IsApproved;
                db.SubmitChanges();
            }
        }
        public override bool UnlockUser(string userEmail)
        {
            // Return status defaults to false
            bool ret = false;
            try
            {
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    tblUser U = (from u in db.tblUsers
                                 where u.Email == userEmail
                                  select u).Single();

                    U.IsLockedOut = false;
                    db.SubmitChanges();
                }

                // A user was found and nothing was thrown
                ret = true;
            }
            catch
            {
                // Couldn't find the user or there was an error
                ret = false;
            }

            return ret;
        }
        public override bool DeleteUser(string Email, bool deleteAllRelatedData)
        {
            // Return status defaults to false.
            // When in doubt, always say "NO".
            bool ret = false;

            try
            {
                //using (UsersDataContext db = new UsersDataContext())
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    tblUser U = (from u in db.tblUsers
                                  where u.Email == Email
                                  select u).Single();
                    db.tblUsers.DeleteOnSubmit(U);

                    // Delete all releated group/role/profile data
                    // See the blog post for more details :
                    // http://eksith.wordpress.com/2010/04/04/linq-to-sql-usership
                    if (deleteAllRelatedData)
                    {
                        //Pas mus issitrina is tblUser per integrity, o is tblUsers_Role netrinam, nes kiti gali naudot
                        //List<usersInGroup> g = (from mg in db.tblUsersInGroups
                        //                          where mg.Member.Username == UserEmail
                        //                          select mg).ToList();

                        //List<MemberContentPrivilege> mc = (from mp in db.MemberContentPrivileges
                        //                                   where mp.Member.Username == UserEmail
                        //                                   select mp).ToList();

                        //db.tblUsersInGroups.DeleteAllOnSubmit(g);
                        //db.MemberContentPrivileges.DeleteAllOnSubmit(mc);
                    }

                    // Save changes in the database
                    db.SubmitChanges();
                }
                // Nothing was thrown, so go ahead and return true
                ret = true;
            }
            catch
            {
                // Couldn't find the user or was not able to delete
                ret = false;
            }

            return ret;
        }
        #endregion

        #region User authentication methods
        /*************************************************************************
         * User authentication methods
         *************************************************************************/

        /// <summary>
        /// Authenticates a user with the given UserEmail and password
        /// </summary>
        /// <param name="password">The login UserEmail</param>
        /// <param name="UserEmail">Login password</param>
        /// <returns>True if successful. Defaults to false.</returns>
        public override bool ValidateUser(string UserEmail, string password)
        {
            // Return status defaults to false.
            bool ret = false;

            try
            {
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    tblUser U = (from u in db.tblUsers
                                  where u.Email == UserEmail
                                  select u).Single();

                    // We found a user by the UserEmail
                    if (U != null)
                    {
                        // A user cannot login if not approved or locked out
                        if ((!U.IsApproved))// || U.IsLockedOut sitas sudas kartais pats pasikeicia
                        { ret = false; }
                        else
                        {
                            // Trigger period
                            DateTime dt = DateTime.Now;

                            // Check the given password and the one stored (and salt, if it exists)
                            if (CheckPassword(password, U.Password))
                            {
                                U.LastLoginDate = dt;
                                // Reset past failures
                                ResetAuthenticationFailures(ref U, dt);
                                ret = true;
                            }
                            else
                            {
                                // The login failed... Increment the login attempt count
                                U.FailedPasswordAttemptCount = (int)U.FailedPasswordAttemptCount + 1;

                                if (U.FailedPasswordAttemptCount >= MaxInvalidPasswordAttempts)
                                    U.IsLockedOut = true;
                            }
                        }

                        // Save changes
                        db.SubmitChanges();
                    }
                }
            }
            catch
            {
                // Nothing was thrown, so go ahead and return true
                ret = false;
            }

            return ret;
        }

        /// <summary>
        /// Gets the current password of a user (provided it isn't hashed)
        /// </summary>
        /// <param name="UserEmail">User the password is being retrieved for</param>
        /// <param name="answer">Password retrieval answer</param>
        /// <returns>User's passsword</returns>
        public override string GetPassword(string UserEmail, string answer)
        {
            // Default password is empty
            string password = String.Empty;
            {
                try
                {
                    using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                    {
                        tblUser U = (from u in db.tblUsers
                                      where u.Email == UserEmail
                                      select u).Single();

                        password = UnEncodePassword(U.Password);
                    }
                }
                catch { }
            }
            return password;
        }

        /// <summary>
        /// Resets the passwords with a generated value
        /// </summary>
        /// <param name="UserEmail">User the password is being reset for</param>
        /// <param name="answer">Password retrieval answer</param>
        /// <returns>Newly generated password</returns>
        public override string ResetPassword(string UserEmail, string answer)
        {
            // Default password is empty
            string Password = String.Empty;

            try
            {
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    tblUser U = (from u in db.tblUsers
                                  where u.Email == UserEmail
                                  select u).Single();
                    // We found a user by that name
                    if (U != null)
                    {
                        // Check if the returned password answer matches
                        if (EncodePassword(answer) == U.PasswordAnswer)
                        {
                            // Create a new password with the minimum number of characters
                            Password = GeneratePassword(MinRequiredPasswordLength);

                            U.Password = EncodePassword(Password);

                            // Reset everyting
                            ResetAuthenticationFailures(ref U, DateTime.Now);

                            db.SubmitChanges();
                        }
                    }
                }
            }
            catch
            {
            }
            return Password;
        }

        /// <summary>
        /// Change the current password for a new one. Note: Both are required.
        /// </summary>
        /// <param name="UserEmail">Username the password is being changed for</param>
        /// <param name="oldPassword">Old password to verify owner</param>
        /// <param name="newPassword">New password</param>
        /// <returns>True if successful. Defaults to false.</returns>
        public override bool ChangePassword(string UserEmail, string oldPassword, string newPassword)
        {
            if (!ValidateUser(UserEmail, oldPassword))
                return false;

            ValidatePasswordEventArgs args = new ValidatePasswordEventArgs(UserEmail, newPassword, false);

            OnValidatingPassword(args);

            if (args.Cancel)
                if (args.FailureInformation != null)
                    throw args.FailureInformation;
                else
                    throw new MembershipPasswordException("Password change has been cancelled due to a validation failure.");

            bool ret = false;
            try
            {
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    tblUser U = (from u in db.tblUsers
                                  where u.Email == UserEmail
                                  select u).Single();
                    U.Password = EncodePassword(newPassword);

                    // Reset everything
                    ResetAuthenticationFailures(ref U, DateTime.Now);
                    db.SubmitChanges();
                }
                ret = true;
            }
            catch { ret = false; }
            return ret;
        }

        /// <summary>
        /// Change the password retreival/reset question and answer pair
        /// </summary>
        /// <param name="UserEmail">Username the question and answer are being changed for</param>
        /// <param name="password">Current password</param>
        /// <param name="newPasswordQuestion">New password question</param>
        /// <param name="newPasswordAnswer">New password answer (will also be encrypted)</param>
        /// <returns>True if successful. Defaults to false.</returns>
        public override bool ChangePasswordQuestionAndAnswer(string UserEmail, string password,
            string newPasswordQuestion, string newPasswordAnswer)
        {
            if (!ValidateUser(UserEmail, password))
                return false;

            bool ret = false;
            try
            {
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    tblUser U = (from u in db.tblUsers
                                  where u.Email == UserEmail
                                  select u).Single();
                    U.PasswordQuestion = newPasswordQuestion;
                    U.PasswordAnswer = EncodePassword(newPasswordAnswer);

                    db.SubmitChanges();
                }
                ret = true;
            }
            catch
            {
                ret = false;
            }
            return ret;
        }
        #endregion


        #region User information retreival methods
        /*************************************************************************
         * User information retreival methods
         *************************************************************************/
        /// <summary>
        /// Gets the UserEmail by a given matching email address
        /// </summary>
        public override string GetUserNameByEmail(string email)
        {
            string UserEmail = String.Empty;

            try
            {
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    UserEmail = (from u in db.tblUsers
                                 where u.Email == UserEmail
                                 select u.Email).Single();
                }
            }
            catch
            {
            }
            return UserEmail;
        }

        /// <summary>
        /// Gets a MembershipUser object with a given key
        /// </summary>
        public override MembershipUser GetUser(object providerLoginKey, bool userIsOnline)
        {
            MembershipUser Mu = null;
            try
            {
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    tblUser U = (from u in db.tblUsers
                                  where u.ID == Convert.ToInt32(providerLoginKey)
                                  select u).Single();
                    if (U != null)
                        Mu = GetUserFromMember(U);
                }
            }
            catch
            { }

            return Mu;
        }

        /// <summary>
        /// Gets a MembershipUser object with a given UserEmail
        /// </summary>
        public override MembershipUser GetUser(string UserEmail, bool userIsOnline)
        {
            MembershipUser Mu = null;

            try
            {
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    tblUser U = (from u in db.tblUsers
                                  where u.Email == UserEmail
                                  select u).Single();
                    if (U != null)
                        Mu = GetUserFromMember(U);
                }
            }
            catch
            { }
            return Mu;
        }

        /// <summary>
        /// Gets all the users in the database
        /// </summary>
        /// <param name="pageIndex">Current page index</param>
        /// <param name="pageSize">Number of results per page</param>
        /// <param name="totalRecords">Total number of users returned</param>
        /// <returns>usershpUserCollection object with a list of users on the page</returns>
        public override MembershipUserCollection GetAllUsers(int pageIndex, int pageSize, out int totalRecords)
        {
            MembershipUserCollection users = new MembershipUserCollection();
            totalRecords = 0;

            try
            {
                int start = pageSize * pageIndex;
                int end = start + pageSize;

                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    totalRecords = (from u in db.tblUsers
                                    select u).Count();
                    List<tblUser> Llist = (from u in db.tblUsers
                                            select u).Skip(start).Take(pageSize).ToList();
                    foreach (tblUser U in Llist)
                        users.Add(GetUserFromMember(U));
                }
            }
            catch { }

            return users;
        }

        /// <summary>
        /// Gets the total number of users that are currently online.
        /// </summary>
        /// <returns>Returns user count (within UserIsOnlineTimeWindow minutes)</returns>
        public override int GetNumberOfUsersOnline()
        {
            throw new NotImplementedException();
            //int c = 0;
            //try
            //{
            //    using (UsersDataContext db = new UsersDataContext())
            //    {
            //        c = (from u in db.tblUsers
            //             where u.LastActivityDate.Add(UserIsOnlineTimeWindow) >= DateTime.Now
            //             select u).Count();
            //    }
            //}
            //catch { }

            //return c;
        }

        /// <summary>
        /// Finds a list of users with a matching email address
        /// </summary>
        /// <param name="emailToMatch">Given email to search</param>
        /// <param name="pageIndex">Current page index</param>
        /// <param name="pageSize">Number of results per page</param>
        /// <param name="totalRecords">Total number of users returned</param>
        /// <returns>usershpUserCollection object with a list of users on the page</returns>
        public override MembershipUserCollection FindUsersByEmail(string emailToMatch, int pageIndex, int pageSize, out int totalRecords)
        {
            MembershipUserCollection users = new MembershipUserCollection();
            totalRecords = 0;

            try
            {
                int start = pageSize * pageIndex;
                int end = start + pageSize;

                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    totalRecords = (from u in db.tblUsers
                                    where u.Email.Contains(emailToMatch)
                                    select u).Count();

                    List<tblUser> Llist = (from u in db.tblUsers
                                            where u.Email.Contains(emailToMatch)
                                            select u).Skip(start).Take(pageSize).ToList();

                    foreach (tblUser U in Llist)
                        users.Add(GetUserFromMember(U));
                }
            }
            catch { }

            return users;
        }

        /// <summary>
        /// Gets a list of users with a matching UserEmail
        /// </summary>
        /// <param name="usernameToMatch">Username to search for</param>
        /// <param name="pageIndex">Current page index</param>
        /// <param name="pageSize">Number of results per page</param>
        /// <param name="totalRecords">Total number of users returned</param>
        /// <returns>usershpUserCollection object with a list of users on the page</returns>
        public override MembershipUserCollection FindUsersByName(string usernameToMatch,
            int pageIndex, int pageSize, out int totalRecords)
        {
            MembershipUserCollection users = new MembershipUserCollection();
            totalRecords = 0;

            try
            {
                int start = pageSize * pageIndex;
                int end = start + pageSize;

                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    totalRecords = (from u in db.tblUsers
                                    select u).Count();
                    List<tblUser> Llist = (from u in db.tblUsers
                                            where u.Email.Contains(usernameToMatch)
                                            select u).Skip(start).Take(pageSize).ToList();
                    foreach (tblUser U in Llist)
                        users.Add(GetUserFromMember(U));
                }
            }
            catch { }

            return users;
        }
        public tblUser GetUser()
        {
            using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
            {
                return (from l in db.tblUsers
                        where l.Email == HttpContext.Current.User.Identity.Name
                        select l).Single();
            }
        }
        #endregion

        #region Class initialization
        /*************************************************************************
         * Class initialization
         *************************************************************************/

        public override void Initialize(string name, System.Collections.Specialized.NameValueCollection config)
        {
            if (config == null)
                throw new ArgumentNullException("config");

            if (name == null || name.Length == 0)
                name = "BSMemProvider";

            if (String.IsNullOrEmpty(config["description"]))
            {
                config.Remove("description");
                config.Add("description", "BS usership Provider");
            }

            // Initialize base class
            base.Initialize(name, config);

            _applicationName = GetConfigValue(config["applicationName"],
                System.Web.Hosting.HostingEnvironment.ApplicationVirtualPath);

            // This is a non-standard helper setting.
            _providerName = GetConfigValue(config["providerName"], name);

            // Sets the default parameters for all the usership Provider settings

            _requiresUniqeEmail = Convert.ToBoolean(GetConfigValue(config["requiresUniqueEmail"], "true"));
            _requiresQuestionAndAnswer = Convert.ToBoolean(GetConfigValue(config["requiresQuestionAndAnswer"], "true"));
            _minRequiredPasswordLength = Convert.ToInt32(GetConfigValue(config["minRequiredPasswordLength"], "5"));
            _minRequiredNonAlphanumericCharacters = Convert.ToInt32(GetConfigValue(config["minRequiredNonAlphanumericCharacters"],
                "0"));
            _enablePasswordReset = Convert.ToBoolean(GetConfigValue(config["enablePasswordReset"], "false"));
            _enablePasswordRetrieval = Convert.ToBoolean(GetConfigValue(config["enablePasswordRetrieval"], "false"));
            _passwordAttemptWindow = Convert.ToInt32(GetConfigValue(config["passwordAttemptWindow"], "10"));
            _passwordStrengthRegularExpression = GetConfigValue(config["passwordStrengthRegularExpression"], "");
            _maxInvalidPasswordAttempts = Convert.ToInt32(GetConfigValue(config["maxInvalidPasswordAttempts"], "5"));
            string passFormat = config["passwordFormat"];

            // If no format is specified, the default format will be hashed.
            if (passFormat == null)
                passFormat = "clear";

            switch (passFormat.ToLower())
            {
                case "hashed":
                    _passwordFormat = MembershipPasswordFormat.Hashed;
                    break;
                case "encrypted":
                    _passwordFormat = MembershipPasswordFormat.Hashed;
                    break;
                case "clear":
                    _passwordFormat = MembershipPasswordFormat.Clear;
                    break;
                default:
                    throw new ProviderException("Password format '" + passFormat + "' is not supported. Check your web.config file.");
            }

            Configuration cfg = WebConfigurationManager.OpenWebConfiguration(
                System.Web.Hosting.HostingEnvironment.ApplicationVirtualPath);

            machineKey = (MachineKeySection)cfg.GetSection("system.web/machineKey");

            if (machineKey.ValidationKey.Contains("AutoGenerate"))
                if (PasswordFormat != MembershipPasswordFormat.Clear)
                    throw new ProviderException("Hashed or Encrypted passwords cannot be used with auto-generated keys.");

            MembershipSection usership = (MembershipSection)cfg.GetSection("system.web/usership");
            _userIsOnlineTimeWindow = usership.UserIsOnlineTimeWindow;
        }
        #endregion

        #region Private password helper methods
        /*************************************************************************
         * Private password helper methods
         *************************************************************************/

        /// <summary>
        /// Compares a given password with one stored in the database and an optional salt
        /// </summary>
        private bool CheckPassword(string password, string dbpassword)
        {
            string pass1 = password;
            string pass2 = dbpassword;
            bool ret = false;

            switch (PasswordFormat)
            {
                case MembershipPasswordFormat.Encrypted:
                    pass2 = UnEncodePassword(dbpassword);
                    break;
                default:
                    break;
            }

            if (pass1 == pass2)
                ret = true;

            return ret;
        }

        /// <summary>
        /// Encodes a given password using the default MembershipPasswordFormat setting
        /// </summary>
        /// <param name="password">Password (plus salt as per above functions if necessary)</param>
        /// <returns>Clear form, Encrypted or Hashed password.</returns>
        private string EncodePassword(string password)
        {
            string encodedPassword = password;

            switch (PasswordFormat)
            {
                case MembershipPasswordFormat.Clear:
                    break;
                case MembershipPasswordFormat.Encrypted:
                    encodedPassword =
                      Convert.ToBase64String(EncryptPassword(Encoding.Unicode.GetBytes(password)));
                    break;
                case MembershipPasswordFormat.Hashed:
                    HMACSHA1 hash = new HMACSHA1();
                    hash.Key = HexToByte(machineKey.ValidationKey);
                    encodedPassword =
                      Convert.ToBase64String(hash.ComputeHash(Encoding.Unicode.GetBytes(password)));
                    break;
                default:
                    throw new ProviderException("Unsupported password format.");
            }

            return encodedPassword;
        }

        /// <summary>
        /// Decodes a given stored password into a cleartype or unencrypted form. Provided it isn't hashed.
        /// </summary>
        /// <param name="encodedPassword">Stored, encrypted password</param>
        /// <returns>Unecncrypted password</returns>
        private string UnEncodePassword(string encodedPassword)
        {
            string password = encodedPassword;

            switch (PasswordFormat)
            {
                case MembershipPasswordFormat.Clear:
                    break;
                case MembershipPasswordFormat.Encrypted:
                    password =
                      Encoding.Unicode.GetString(DecryptPassword(Convert.FromBase64String(password)));
                    break;
                case MembershipPasswordFormat.Hashed:
                    throw new ProviderException("Cannot decode hashed passwords.");
                default:
                    throw new ProviderException("Unsupported password format.");
            }

            return password;
        }

        /// <summary>
        /// Converts a string into a byte array
        /// </summary>
        private byte[] HexToByte(string hexString)
        {
            byte[] returnBytes = new byte[hexString.Length / 2];
            for (int i = 0; i < returnBytes.Length; i++)
                returnBytes[i] = Convert.ToByte(hexString.Substring(i * 2, 2), 16);
            return returnBytes;
        }

        /// <summary>
        /// Salt generation helper (this is essentially the same as the one in SqlMembershipProviders
        /// </summary>
        private string GenerateSalt()
        {
            byte[] buf = new byte[16];
            (new RNGCryptoServiceProvider()).GetBytes(buf);
            return Convert.ToBase64String(buf);
        }

        /// <summary>
        /// Generates a random password of given length (MinRequiredPasswordLength)
        /// </summary>
        private string GeneratePassword(int passLength)
        {
            string _range = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            Byte[] _bytes = new Byte[passLength];
            char[] _chars = new char[passLength];

            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();

            rng.GetBytes(_bytes);

            for (int i = 0; i < passLength; i++)
                _chars[i] = _range[_bytes[i] % _range.Length];

            return new string(_chars);
        }
        #endregion

        #region Private helper methods
        /*************************************************************************
         * Private helper methods
         *************************************************************************/

        /// <summary>
        /// Used in the initializtion, key in web.config or the default setting if null.
        /// </summary>
        private string GetConfigValue(string configValue, string defaultValue)
        {
            if (String.IsNullOrEmpty(configValue))
                return defaultValue;

            return configValue;
        }

        /// <summary>
        /// Upon a successful login or password reset, this changes all the previous failure markers to defaults.
        /// </summary>
        private static void ResetAuthenticationFailures(ref tblUser U, DateTime dt)
        {
            U.LastPasswordChangedDate = dt;
            U.FailedPasswordAttemptCount = 0;
            U.FailedPasswordAttemptCount = 0;
            //U.FailedPasswordAnswerAttemptWindowStart = dt;
            //CC.Classes.UserData.SetParameters(U);
        }

        /// <summary>
        /// Converts a Member object into a MembershipUser object using its assigned settings
        /// </summary>
        private MembershipUser GetUserFromMember(tblUser U)
        {
            return new MembershipUser(this.ProviderName,
                        U.FirstName + " "+ U.Surname,
                        U.ID,
                        U.Email,
                        U.PasswordQuestion,
                        U.Comment,
                        U.IsApproved,
                        U.IsLockedOut,
                        U.CreatedDate,
                        U.LastLoginDate,
                        U.LastLoginDate,
                        U.LastPasswordChangedDate,
                        U.LastLockOutDate);
        }
    }
        #endregion

    public sealed class BSRoleProvider : RoleProvider
    {

        #region General settings
        /*************************************************************************
            * General settings
            *************************************************************************/

        private string _applicationName;
        public override string ApplicationName
        {
            get { return _applicationName; }
            set { _applicationName = value; }
        }

        #endregion

        #region Retrieval methods
        /*************************************************************************
            * Retrieval methods
            *************************************************************************/

        /// <summary>
        /// Gets all available user roles
        /// </summary>
        /// <returns>Array of all available roles</returns>
        public override string[] GetAllRoles()
        {
            string[] roles = null;
            using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
            {
                roles = (from ur in db.tblUsers_Roles
                         select ur.Name).ToArray();
            }
            return roles;
        }
        /// <summary>
        /// Gets the assigned roles for a particular user.
        /// </summary>
        /// <param name="UserEmail">Matching UserEmail</param>
        /// <returns>Array of assigned roles</returns>
        public override string[] GetRolesForUser(string UserEmail)
        {
            string[] roles = null;
            using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
            {
                roles = (from rINg in db.tblUsers_RolesInGroups
                         join
                             rG in db.tblUsers_RolesGroups on rINg.RoleGroupID equals rG.ID
                         join
                             U in db.tblUsers on rG.ID equals U.RoleGroupID
                         where U.Email == UserEmail
                         select rINg.tblUsers_Role.Name).ToArray();
            }
            return roles;
        }

        /// <summary>
        /// Gets all the users in a particular role
        /// </summary>
        public override string[] GetUsersInRole(string roleName)
        {
            string[] u = null;
            using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
            {
                u = (from rINg in db.tblUsers_RolesInGroups
                          join
                              rG in db.tblUsers_RolesGroups on rINg.RoleGroupID equals rG.ID
                          join
                              U in db.tblUsers on rG.ID equals U.RoleGroupID
                          where rINg.tblUsers_Role.Name == roleName
                          select U.Email).ToArray();
            }
            return u;
            // Without paging, this function seems pointless to me,
            // so I didn't implement it. Should be simple enough using the previous code though.
            //throw new NotImplementedException();
        }
        #endregion

        #region Create and Delete methods
        /*************************************************************************
            * Create and Delete methods
            *************************************************************************/

        /// <summary>
        /// Creates a new role
        /// </summary>
        public override void CreateRole(string roleName)
        {
            throw new NotImplementedException();
        }
        public void CreateRole(string roleName, string roleGroupName)
        {
            //No need to add if it already exists
            if (!RoleExists(roleName))
            {
                tblUsers_RolesGroup G = null;
                tblUsers_Role R = null;
                tblUsers_RolesInGroup RinG = null;
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    G = (from rG in db.tblUsers_RolesGroups
                         select rG).Single();
                    if (G == null)//Jei tokios grupes nera pridedam grupe
                    {
                        G = new tblUsers_RolesGroup();
                        G.Name = roleGroupName;
                        db.tblUsers_RolesGroups.InsertOnSubmit(G);
                    }
                    R = new tblUsers_Role();//Pridedam role
                    R.Name = roleName;
                    db.tblUsers_Roles.InsertOnSubmit(R);
                    db.SubmitChanges();
                    RinG = new tblUsers_RolesInGroup();//Pridedam rysi tarp roles ir roliugrupes
                    RinG.RoleGroupID = G.ID;
                    RinG.RoleID = R.ID;
                    db.tblUsers_RolesInGroups.InsertOnSubmit(RinG);
                    db.SubmitChanges();
                }
            }
        }
        /// <summary>
        /// Deletes a given role
        /// </summary>
        /// <param name="roleName">Role name to delete</param>
        /// <param name="throwOnPopulatedRole">Specifies whether the function should throw
        /// if there are assigned users to this role</param>
        /// <returns>True if successful. Defaults to false</returns>
        public override bool DeleteRole(string roleName, bool throwOnPopulatedRole)
        {
            // Return status. Defaults to false.
            bool ret = false;

            // You can only delete an existing role
            if (RoleExists(roleName))
            {
                try
                {
                    using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                    {
                        if (throwOnPopulatedRole)
                        {
                            if ((from rINg in db.tblUsers_RolesInGroups
                                 join
                                     rG in db.tblUsers_RolesGroups on rINg.RoleGroupID equals rG.ID
                                 join
                                     U in db.tblUsers on rG.ID equals U.RoleGroupID
                                 where rINg.tblUsers_Role.Name == roleName
                                 select U.ID).Count() > 0)
                            {
                                throw new ProviderException("Cannot delete roles with users assigned to them");
                            }
                        }

                        tblUsers_Role Lr = (from r in db.tblUsers_Roles
                                             where r.Name == roleName
                                             select r).FirstOrDefault();

                        int[] GroupID = (from G in db.tblUsers_RolesGroups
                                         join
                                             rINg in db.tblUsers_RolesInGroups on G.ID equals rINg.RoleGroupID
                                         where rINg.tblUsers_Role.ID == Lr.ID
                                         select G.ID).ToArray();
                        if (GroupID.Count() == 1)//istrinam visa grupe
                        {
                            tblUsers_RolesGroup LG = (from G in db.tblUsers_RolesGroups
                                                        where G.ID == GroupID[0]
                                                        select G).FirstOrDefault();
                            db.tblUsers_RolesGroups.DeleteOnSubmit(LG);
                        }
                        else { db.tblUsers_Roles.DeleteOnSubmit(Lr); }
                        db.SubmitChanges();
                        ret = true;
                    }
                }
                catch { }
            }

            return ret;
        }
        #endregion

        #region Assign/Remove methods
        /*************************************************************************
            * Assign/Remove methods
            *************************************************************************/

        /// <summary>
        /// Adds a collection of users to a collection of corresponding roles
        /// </summary>
        public override void AddUsersToRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
            //// Get the actual available roles
            //string[] allRoles = GetAllRoles();

            //// See if any of the given roles match the available roles
            //IEnumerable<string> roles = allRoles.Intersect(roleNames);

            //// There were some roles left after removing non-existent ones
            //if (roles.Count() > 0)
            //{
            //    // Cleanup duplicates first
            //    RemoveUsersFromRoles(usernames, roleNames);

            //    using (UsersDataContext db = new UsersDataContext())
            //    {
            //        // Get the user IDs
            //        List<int> Llist = (from u in db.tblUsers
            //                           where usernames.Contains(u.Email)
            //                           select u.ID).ToList();

            //        // Get the group IDs
            //        List<int> glist = (from groups in db.Groups
            //                           where roleNames.Contains(groups.Title)
            //                           select groups.GroupId).ToList();

            //        // Fresh list of user-role assignments
            //        List<usersInGroup> mglist = new List<usersInGroup>();
            //        foreach (int m in Llist)
            //        {
            //            foreach (int g in glist)
            //            {
            //                usersInGroup mg = new usersInGroup();
            //                mg.MemberId = m;
            //                mg.GroupId = g;
            //                mglist.Add(mg);
            //            }
            //        }

            //        db.tblUsersInGroups.InsertAllOnSubmit(mglist);
            //        db.SubmitChanges();
            //    }
            //}
        }

        /// <summary>
        /// Remove a collection of users from a collection of corresponding roles
        /// </summary>
        public override void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
            //// Get the actual available roles
            //string[] allRoles = GetAllRoles();

            //// See if any of the given roles match the available roles
            //IEnumerable<string> roles = allRoles.Intersect(roleNames);

            //// There were some roles left after removing non-existent ones
            //if (roles.Count() > 0)
            //{
            //    using (UsersDataContext db = new UsersDataContext())
            //    {
            //        List<usersInGroup> mg = (from users in db.tblUsersInGroups
            //                                 where usernames.Contains(users.Member.Username) &&
            //                                 roleNames.Contains(users.Group.Title)
            //                                 select u).ToList();

            //        db.tblUsersInGroups.DeleteAllOnSubmit(mg);
            //        db.SubmitChanges();
            //    }
            //}
        }
        #endregion

        #region Searching methods
        /*************************************************************************
            * Searching methods
            *************************************************************************/

        /// <summary>
        /// Checks if a given UserEmail is in a particular role
        /// </summary>
        public override bool IsUserInRole(string UserEmail, string roleName)
        {
            // Return status defaults to false
            bool ret = false;
            if (RoleExists(roleName))
            {
                using (dbDataContext db = new dbDataContext(ConfigurationManager.ConnectionStrings["ClaimsControlConnectionString"].ConnectionString))
                {
                    if ((from rINg in db.tblUsers_RolesInGroups
                         join
                             rG in db.tblUsers_RolesGroups on rINg.RoleGroupID equals rG.ID
                         join
                             U in db.tblUsers on rG.ID equals U.RoleGroupID
                         where U.Email == UserEmail && rINg.tblUsers_Role.Name == roleName
                         select rINg.tblUsers_Role.Name).Count() > 0)
                        ret = true;
                }
            }
            return ret;
        }

        /// <summary>
        /// Finds a set of users in a given role
        /// </summary>
        public override string[] FindUsersInRole(string roleName, string usernameToMatch)
        {
            // Here's another function that doesn't make sense without paging
            throw new NotImplementedException();
        }

        /// <summary>
        /// Checks if a given role already exists in the database
        /// </summary>
        /// <param name="roleName">Role name to search</param>
        /// <returns>True if the role exists. Defaults to false.</returns>
        public override bool RoleExists(string roleName)
        {
            bool ret = false;

            // If the specified role doesn't exist
            if (!GetAllRoles().Contains(roleName))
                ret = true;

            return ret;
        }
        #endregion

        #region Initialization
        /*************************************************************************
            * Initialization
            *************************************************************************/

        /// <summary>
        /// Initialize the RoleProvider
        /// </summary>
        public override void Initialize(string name, System.Collections.Specialized.NameValueCollection config)
        {
            if (config == null)
                throw new ArgumentNullException("config");

            if (name == null || name.Length == 0)
                name = "BSRoleProvider";

            if (String.IsNullOrEmpty(config["description"]))
            {
                config.Remove("description");
                config.Add("description", "BS Role Provider");
            }

            // Initialize base class
            base.Initialize(name, config);

            _applicationName = GetConfigValue(config["applicationName"],
                System.Web.Hosting.HostingEnvironment.ApplicationVirtualPath);

        }

        #endregion

        #region GetConfigValue
        /*************************************************************************
            * Private helper methods
            *************************************************************************/

        private string GetConfigValue(string configValue, string defaultValue)
        {
            if (String.IsNullOrEmpty(configValue))
                return defaultValue;

            return configValue;
        }
        #endregion
    }
}