using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using SampleApp.Models;

namespace SampleApp.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SampleApp.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Product>("Products1");
    builder.EntitySet<COG>("COGs"); 
    builder.EntitySet<Sold>("Solds"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class Products1Controller : ODataController
    {
        private SampleDbEntities db = new SampleDbEntities();

        // GET: odata/Products1
        [EnableQuery]
        public IQueryable<Product> GetProducts1()
        {
            return db.Products;
        }

        // GET: odata/Products1(5)
        [EnableQuery]
        public SingleResult<Product> GetProduct([FromODataUri] long key)
        {
            return SingleResult.Create(db.Products.Where(product => product.ProductID == key));
        }

        // PUT: odata/Products1(5)
        public IHttpActionResult Put([FromODataUri] long key, Delta<Product> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Product product = db.Products.Find(key);
            if (product == null)
            {
                return NotFound();
            }

            patch.Put(product);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(product);
        }

        // POST: odata/Products1
        public IHttpActionResult Post(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Products.Add(product);
            db.SaveChanges();

            return Created(product);
        }

        // PATCH: odata/Products1(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] long key, Delta<Product> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Product product = db.Products.Find(key);
            if (product == null)
            {
                return NotFound();
            }

            patch.Patch(product);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(product);
        }

        // DELETE: odata/Products1(5)
        public IHttpActionResult Delete([FromODataUri] long key)
        {
            Product product = db.Products.Find(key);
            if (product == null)
            {
                return NotFound();
            }

            db.Products.Remove(product);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Products1(5)/COGs
        [EnableQuery]
        public IQueryable<COG> GetCOGs([FromODataUri] long key)
        {
            return db.Products.Where(m => m.ProductID == key).SelectMany(m => m.COGs);
        }

        // GET: odata/Products1(5)/Solds
        [EnableQuery]
        public IQueryable<Sold> GetSolds([FromODataUri] long key)
        {
            return db.Products.Where(m => m.ProductID == key).SelectMany(m => m.Solds);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ProductExists(long key)
        {
            return db.Products.Count(e => e.ProductID == key) > 0;
        }
    }
}
