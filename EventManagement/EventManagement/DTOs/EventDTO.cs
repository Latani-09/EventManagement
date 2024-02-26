using System.Globalization;

namespace EventManagement.DTOs
{
    public class EventDTO
    {
        public string Title { get; set; }
        public string hostId { get; set; }  
        public string? Description { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string? Location { get; set; }
        public string? foodServed { get; set; }
        public DateTime? DeserializeDate()
        {
            if (StartDate != null)
            {
                // Use DateTime.TryParseExact to attempt parsing with a specific format
                if (DateTime.TryParse(StartDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDateTime))
                {
                    return parsedDateTime;
                }
                else
                {
                    // Return null if the date is not in the expected format
                    return null;
                }
            }
            else
            {
                // Return null if Due is null
                return null;
            }
        }
    }
}
