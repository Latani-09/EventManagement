using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventManagement.Data.Migrations
{
    public partial class RsvpTodbcontext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RSVP_Events_EventID",
                table: "RSVP");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RSVP",
                table: "RSVP");

            migrationBuilder.RenameTable(
                name: "RSVP",
                newName: "RSVPs");

            migrationBuilder.RenameIndex(
                name: "IX_RSVP_EventID",
                table: "RSVPs",
                newName: "IX_RSVPs_EventID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RSVPs",
                table: "RSVPs",
                column: "RSVPID");

            migrationBuilder.AddForeignKey(
                name: "FK_RSVPs_Events_EventID",
                table: "RSVPs",
                column: "EventID",
                principalTable: "Events",
                principalColumn: "eventID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RSVPs_Events_EventID",
                table: "RSVPs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RSVPs",
                table: "RSVPs");

            migrationBuilder.RenameTable(
                name: "RSVPs",
                newName: "RSVP");

            migrationBuilder.RenameIndex(
                name: "IX_RSVPs_EventID",
                table: "RSVP",
                newName: "IX_RSVP_EventID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RSVP",
                table: "RSVP",
                column: "RSVPID");

            migrationBuilder.AddForeignKey(
                name: "FK_RSVP_Events_EventID",
                table: "RSVP",
                column: "EventID",
                principalTable: "Events",
                principalColumn: "eventID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
