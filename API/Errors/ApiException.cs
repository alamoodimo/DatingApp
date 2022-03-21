using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiException
    {
        public ApiException(int status, string messages = null, string details = null)
        {
            Status = status;
            Messages = messages;
            Details = details;
        }

        public int Status { get; set; }
        public string Messages { get; set; }
         public string Details { get; set; }
    }
}