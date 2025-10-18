using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private static readonly string DataFilePath = Path.Combine(AppContext.BaseDirectory, "data.json");

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        if (!System.IO.File.Exists(DataFilePath))
        {
            return NotFound("Data file not found. Ensure the collector service is running.");
        }

        try
        {   
            // reading the data.json file
            var json = await System.IO.File.ReadAllTextAsync(DataFilePath);
            var entries = JsonSerializer.Deserialize<List<AnalyticsEntry>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (entries == null)
            {
                return Ok(new List<AnalyticsEntry>());
            }

            // return the last 10 entries in descending order of timestamp (newest first)
            var latestEntries = entries.OrderByDescending(e => e.Timestamp).Take(10).ToList();

            return Ok(latestEntries);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}