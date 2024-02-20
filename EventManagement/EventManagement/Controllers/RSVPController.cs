using EventManagement.Data;
using EventManagement.DTOs;
using EventManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EventManagement.Controllers
{
    public class RSVPController : Controller
    {
        private readonly ILogger<RSVPController> _logger;
        private ApplicationDbContext _dataContext;


        public RSVPController(ILogger<RSVPController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            _dataContext = dbContext;


        }

        [HttpGet]
        public async  Task< IEnumerable<RSVP>> Get(string ID)
        {
            var e= await _dataContext.Events
      .Where(t => t.eventID.ToString() == ID)
      .FirstOrDefaultAsync();
            return e.Rsvps;

        }


        [HttpPost("createRSVP")]
        public async Task<ActionResult> AddRSVP([FromBody] RSVPDTO rsvp)
        {
            var e = await _dataContext.Events
      .Where(t => t.eventID.ToString() == rsvp.eventID)
      .FirstOrDefaultAsync();



            RSVP rsvpToAdd = new RSVP()
            {
                RSVPID = new Guid(),
                EventID = e.eventID,
                attendieName = rsvp.attendieName,
                emailID = rsvp.emailID,
                
            };
            e.Rsvps.Add(rsvpToAdd); 
            await _dataContext.RSVPs.AddAsync(rsvpToAdd);
            await _dataContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("delete/{RSVPID}")]
        public async Task<ActionResult> Delete(string rsvpID)
        {
            var rsvpDelete = await _dataContext.RSVPs
      .Where(t => t.RSVPID.ToString() == rsvpID)
      .FirstOrDefaultAsync();

            if (rsvpDelete == null)
            {
                return NotFound(); // or any other appropriate response
            }

            _dataContext.RSVPs.Remove(rsvpDelete);
            
            await _dataContext.SaveChangesAsync();
            return Ok();
        }

    }
}
