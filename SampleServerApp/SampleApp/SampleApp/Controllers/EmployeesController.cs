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
    builder.EntitySet<Employee>("Employees");
    builder.EntitySet<Category>("Categories"); 
    builder.EntitySet<COG>("COGs"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EmployeesController : ODataController
    {
        private SampleDbEntities db = new SampleDbEntities();

        // GET: odata/Employees
        [EnableQuery(PageSize = 30)]
        public IQueryable<Employee> GetEmployees()
        {
            return db.Employees;
        }

        // GET: odata/Employees(5)
        [EnableQuery]
        public SingleResult<Employee> GetEmployee([FromODataUri] long key)
        {
            return SingleResult.Create(db.Employees.Where(employee => employee.EmployeeID == key));
        }

        // PUT: odata/Employees(5)
        public IHttpActionResult Put([FromODataUri] long key, Delta<Employee> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Employee employee = db.Employees.Find(key);
            if (employee == null)
            {
                return NotFound();
            }

            patch.Put(employee);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employee);
        }

        // POST: odata/Employees
        public IHttpActionResult Post(Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Employees.Add(employee);
            db.SaveChanges();

            return Created(employee);
        }

        // PATCH: odata/Employees(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] long key, Delta<Employee> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Employee employee = db.Employees.Find(key);
            if (employee == null)
            {
                return NotFound();
            }

            patch.Patch(employee);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employee);
        }

        // DELETE: odata/Employees(5)
        public IHttpActionResult Delete([FromODataUri] long key)
        {
            Employee employee = db.Employees.Find(key);
            if (employee == null)
            {
                return NotFound();
            }

            db.Employees.Remove(employee);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Employees(5)/Category
        [EnableQuery]
        public SingleResult<Category> GetCategory([FromODataUri] long key)
        {
            return SingleResult.Create(db.Employees.Where(m => m.EmployeeID == key).Select(m => m.Category));
        }

        // GET: odata/Employees(5)/COGs
        [EnableQuery]
        public IQueryable<COG> GetCOGs([FromODataUri] long key)
        {
            return db.Employees.Where(m => m.EmployeeID == key).SelectMany(m => m.COGs);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeExists(long key)
        {
            return db.Employees.Count(e => e.EmployeeID == key) > 0;
        }
    }
}
