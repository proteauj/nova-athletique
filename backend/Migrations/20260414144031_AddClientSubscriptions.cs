using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovaAthletique.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClientSubscriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientSubscription_Clients_ClientId",
                table: "ClientSubscription");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ClientSubscription",
                table: "ClientSubscription");

            migrationBuilder.RenameTable(
                name: "ClientSubscription",
                newName: "ClientSubscriptions");

            migrationBuilder.RenameIndex(
                name: "IX_ClientSubscription_ClientId",
                table: "ClientSubscriptions",
                newName: "IX_ClientSubscriptions_ClientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClientSubscriptions",
                table: "ClientSubscriptions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientSubscriptions_Clients_ClientId",
                table: "ClientSubscriptions",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientSubscriptions_Clients_ClientId",
                table: "ClientSubscriptions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ClientSubscriptions",
                table: "ClientSubscriptions");

            migrationBuilder.RenameTable(
                name: "ClientSubscriptions",
                newName: "ClientSubscription");

            migrationBuilder.RenameIndex(
                name: "IX_ClientSubscriptions_ClientId",
                table: "ClientSubscription",
                newName: "IX_ClientSubscription_ClientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClientSubscription",
                table: "ClientSubscription",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientSubscription_Clients_ClientId",
                table: "ClientSubscription",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id");
        }
    }
}
