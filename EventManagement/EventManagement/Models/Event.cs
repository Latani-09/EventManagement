namespace EventManagement.Models
{
    public class Event
    {
        public Guid eventID { get; set; }
        public string hostId { get; set; }
        public string hostName { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Location { get; set;}
        public virtual ICollection<RSVP> Rsvps { get; set; }
        public int No_Attending {  get; set; } = 0;
        public bool foodServed { get; set; }=false;
    }
}
