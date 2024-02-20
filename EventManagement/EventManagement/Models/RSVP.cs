namespace EventManagement.Models
{
    public class RSVP

    {
        public Guid RSVPID { get; set; }
        public Guid EventID { get; set; }
        public Event Event { get; set; }
        public string attendieName { get; set; }
        public string? emailID { get; set; }
    }
}
