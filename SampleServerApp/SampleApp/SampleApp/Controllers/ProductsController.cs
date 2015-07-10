using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Web.Mvc;
using SampleApp.Models;
using DevMvcComponent.Pagination;
namespace SampleApp.Controllers
{
    public class ProductsController : Controller
    {
        private SampleDbEntities db = new SampleDbEntities();

        public JsonResult Get(int page = 1) {
            var products = db.Products
                //.Select(n => new {
                //    n.ProductID,
                //    n.ProductName,
                //    n.Dated
                //})
                .OrderBy(n=> n.ProductID);

            if (page <= 0) {
                page = 1;
            }
            var pageInfo = new PaginationInfo() {
                PageNumber = page,
                PagesExists = null,
                ItemsInPage = 30
            };
            var paged = products.GetPageData(pageInfo, "Products.Get.Count");
            return Json(paged, JsonRequestBehavior.AllowGet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

     
    }
}