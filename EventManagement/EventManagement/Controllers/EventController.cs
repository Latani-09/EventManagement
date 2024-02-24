using EventManagement.Data;
using EventManagement.DTOs;
using EventManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Threading.Tasks;

namespace EventManagement.Controllers
{
   
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {

        private readonly ILogger<EventController> _logger;
        private ApplicationDbContext _dataContext;
        

        public EventController(ILogger<EventController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            _dataContext = dbContext;
           

        }
        [Authorize]
        [HttpGet("getEvents/{hostID}")]
        public async Task<ActionResult<IEnumerable<Event>>> Get(string hostID)
        {

            var events = _dataContext.Events.Where(e => e.hostId == hostID).ToArray();
            return events;
        }
        [HttpGet]
        public IEnumerable<Event> Get()
        {

            return _dataContext.Events.ToArray();

        }

        [Authorize]
        [HttpPost("createEvent")]
        public async Task<ActionResult> AddEvent([FromBody] EventDTO eventDetails)
        {
            Event eventToAdd = new Event()
            {
                eventID = new Guid(),
                Title = eventDetails.Title,
                Description = eventDetails.Description,
                StartDate=eventDetails.DeserializeDate(),
                hostId = eventDetails.hostId,
                hostName=eventDetails.hostId,
                Location=eventDetails.Location


            };
            _dataContext.AddAsync(eventToAdd);
            await _dataContext.SaveChangesAsync();
            return Ok();
        }
        [Authorize]
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

        [Authorize]
        [HttpPut("editEvent")]
        public async Task<ActionResult> Edit(string id, [FromBody] EventDTO eventDetails)
        {
            Event eventToEdit = _dataContext.Events.SingleOrDefault(d => (d.eventID).ToString() == id);
            eventToEdit.Title = eventDetails.Title;
            eventToEdit.Description = eventDetails.Description;
            eventToEdit.StartDate = eventDetails.DeserializeDate();
            eventToEdit.EndDate = DateTime.Now.AddDays(7);
            _dataContext.SaveChangesAsync();
            return Ok();

        }
    }
}
