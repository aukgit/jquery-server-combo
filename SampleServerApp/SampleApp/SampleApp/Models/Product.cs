//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SampleApp.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Product
    {
        public Product()
        {
            this.COGs = new HashSet<COG>();
            this.Solds = new HashSet<Sold>();
        }
    
        public long ProductID { get; set; }
        public string ProductName { get; set; }
        public System.DateTime Dated { get; set; }
    
        public virtual ICollection<COG> COGs { get; set; }
        public virtual ICollection<Sold> Solds { get; set; }
    }
}