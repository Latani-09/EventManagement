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
using EventManagement.Data.Migrations;

namespace EventManagement.Controllers
{

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


        [HttpGet("confirmRSVP/{rsvpID}")]
        public async Task<ActionResult> confirmRSVP(string rsvpID)
        {
           
            var rsvp = await _dataContext.RSVPs.SingleOrDefaultAsync(t => t.RSVPID.ToString() == rsvpID);

            if (rsvp != null)
            {
                rsvp.confirmed = true;
                var eventToupdate = await _dataContext.Events.FirstOrDefaultAsync(t => t.eventID.ToString() == rsvp.EventID.ToString());
                eventToupdate.No_Attending += 1;

                await _dataContext.SaveChangesAsync();
                return Ok();
            }
            return BadRequest();

            
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

        [HttpPost("sendMail")]
        public async Task<ActionResult> SendMail([FromBody] RSVPDTO rsvp){
            var e = await _dataContext.Events.Include(ev=>ev.Rsvps)
     .SingleOrDefaultAsync(t => t.eventID.ToString() == rsvp.eventID);

            Console.Write("eventID found", e.eventID,e.hostId,e.Title);
            if (e == null)
            {
                return NotFound("Event not found");
            }
            var existingRsvp = e.Rsvps.FirstOrDefault(r => r.emailID == rsvp.emailID);

            if (existingRsvp != null)
            {

                return BadRequest(new { message = "duplicateRSVP" });
            }

            RSVP rsvpToAdd = new RSVP()
                {
                    RSVPID = new Guid(),
                    EventID = e.eventID,
                    attendieName = rsvp.attendieName,
                    emailID = rsvp.emailID,

                };

                await _dataContext.RSVPs.AddAsync(rsvpToAdd);
                await _dataContext.SaveChangesAsync();
                var apiKey = _configuration.GetSection("SendGrid")["tlatani18@gmail.com"];  //replace with host.id
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress("tlatani18@gmail.com", "Event organizer");  //replace with host.id
            var subject = "Event Registration confirmation";
                var to = new EmailAddress(rsvp.emailID, "User");
                var plainTextContent = "Thank you for registering the following event";
                var htmlContent = $"<h1><strong>{e.Title} </strong></h1><p>Starting Date and time: {e.StartDate}<p><p>Click the link below to confirm participation </p><p>https://localhost:44431/rsvpConfirm/{rsvpToAdd.RSVPID}</p>";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = await client.SendEmailAsync(msg);
            Console.WriteLine(response.Body);
                Console.WriteLine(response.StatusCode);
            if (response.StatusCode == HttpStatusCode.Accepted)
            {
                return Ok(response.StatusCode);

            }
            else
            {
                return BadRequest(response.StatusCode);
            }
        }
    }

}
