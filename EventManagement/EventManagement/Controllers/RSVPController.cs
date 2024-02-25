using EventManagement.Data;
using EventManagement.DTOs;
using EventManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net.Mail;
using System.Net;
using SendGrid.Helpers.Mail;
using SendGrid;

namespace EventManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class RSVPController : ControllerBase
    {
        private readonly ILogger<RSVPController> _logger;
        private ApplicationDbContext _dataContext;
        private readonly IConfiguration _configuration;

        public RSVPController(ILogger<RSVPController> logger, ApplicationDbContext dbContext, IConfiguration configuration)
        {
            _logger = logger;
            _dataContext = dbContext;
            _configuration = configuration;
        }

        [HttpGet("{ID}")]
        public async  Task< IEnumerable<RSVP>> Get(string ID)
        {
            var e= await _dataContext.Events
      .Where(t => t.eventID.ToString() == ID)
      .FirstOrDefaultAsync();
            return e.Rsvps.ToArray();

        }


        [HttpPost("createRSVP")]
        public async Task<ActionResult> AddRSVP([FromBody] RSVPDTO rsvp)
        {
            Console.Write("eventID to search", rsvp.eventID);
            var e = await _dataContext.Events
     .SingleOrDefaultAsync(t => t.eventID.ToString() == rsvp.eventID);
            Console.Write("eventID found", e.eventID);
            RSVP rsvpToAdd = new RSVP()
            {
                RSVPID = new Guid(),
                EventID = e.eventID,
                attendieName = rsvp.attendieName,
                emailID = rsvp.emailID,
                
            };
            e.No_Attending += 1;
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

        [HttpPost("sendMail/{title}")]
        public async Task SendMail(string title){
            
            var apiKey = _configuration.GetSection("SendGrid")["ApiKey"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("latani2709@gmail.com", "Event organizer");
            var subject = "Event Registration confirmation";
            var to = new EmailAddress("tlatani18@gmail.com", "User");
            var plainTextContent = "Thank you for registering event Following are the details of events";
            var htmlContent = $"<strong>Your email has been registered for the Event.{title} </strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            Console.WriteLine(response.StatusCode);
        }
    }

}
