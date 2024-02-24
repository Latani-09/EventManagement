using SendGrid.Helpers.Mail;
using SendGrid;

namespace EventManagement
{
    public class SendMail
    {
        private static void Main()
        {
            Environment.SetEnvironmentVariable("API_KEY", "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");
            Execute().Wait();
        }

        public static async Task Execute()
        {
            Environment.SetEnvironmentVariable("API_KEY", "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");
            var apiKey = Environment.GetEnvironmentVariable("API_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("tlatani18@gmail.com", "Example User");
            var subject = "Sending with SendGrid is Fun";
            var to = new EmailAddress("latani2709@gmail.com", "Example User");
            var plainTextContent = "and easy to do anywhere, even with C#";
            var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            Console.WriteLine(response.StatusCode);
        }
    }
}

