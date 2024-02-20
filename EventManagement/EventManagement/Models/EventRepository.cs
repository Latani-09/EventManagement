using EventManagement.Controllers;
using EventManagement.Data;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Reflection;

namespace EventManagement.Models
{
    public class EventRepository
    {
      
        private ApplicationDbContext db;

        public   IQueryable<Event> FindAllEvents()
        {
            return db.Events;
        }

        public IQueryable<Event> FindUpcomingEvents()
        {
            return from Event in db.Events
                   where Event.StartDate > DateTime.Now
                   orderby Event.StartDate
                   select Event;
        }

        public Event GetEvent(string id)
        {
            return db.Events.SingleOrDefault(d => (d.eventID).ToString() == id);
        }

        //
        // Insert/Delete Methods

        public async void  Add(Event Event)
        {
            db.Events.AddAsync(Event);
        }


        public async void Delete(Event Event)
        {
            db.RSVPs.RemoveRange(Event.Rsvps);
            db.Events.Remove(Event);
        }

        //
        // Persistence 

        public async void Save()
        {
            db.SaveChangesAsync();
        }
       
    }
}