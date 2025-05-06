using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ChefGeminiAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeedIngredients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Ingredients",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Tomato" },
                    { 2, "Onion" },
                    { 3, "Garlic" },
                    { 4, "Olive Oil" },
                    { 5, "Salt" },
                    { 6, "Black Pepper" },
                    { 7, "Basil" },
                    { 8, "Oregano" },
                    { 9, "Paprika" },
                    { 10, "Chicken Breast" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Ingredients",
                keyColumn: "Id",
                keyValue: 10);
        }
    }
}
