using Microsoft.AspNetCore.Mvc;

namespace EventManagement.Controllers
{
    public class RSVPController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
