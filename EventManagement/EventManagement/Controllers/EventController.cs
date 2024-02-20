using EventManagement.Data;
using EventManagement.DTOs;
using EventManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace EventManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        
        private readonly ILogger<EventController> _logger;
        private ApplicationDbContext _dataContext; 

        public EventController(ILogger<EventController> logger,ApplicationDbContext dbContext)
        {
            _logger = logger;
            _dataContext = dbContext;
        }

        [HttpGet]
        public IEnumerable<Event> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new Event
            {
                Title = "Sample Event",
                Description = "Description sample",
                StartDate = DateTime.Now,
            })
            .ToArray();
        }


        [HttpPost("createEvent")]
        public async Task<ActionResult> AddEvent([FromBody]EventDTO eventDetails)
        {
            Event eventToAdd = new Event()
            {
                eventID=new Guid(),
                Title = eventDetails.Title,
                Description = eventDetails.Description
            };
            _dataContext.AddAsync(eventToAdd);
            await _dataContext.SaveChangesAsync();  
            return Ok();
        }

        [HttpDelete("delete/{eventID}")]
        public async Task<ActionResult> Delete(string eventID)
        {
            var taskDelete = await _dataContext.Events
      .Where(t => t.eventID.ToString() == eventID)
      .FirstOrDefaultAsync();

            if (taskDelete == null)
            {
                return NotFound(); // or any other appropriate response
            }

            _dataContext.Events.Remove(taskDelete);
            await _dataContext.SaveChangesAsync();
            return Ok();
        }
        }
}
