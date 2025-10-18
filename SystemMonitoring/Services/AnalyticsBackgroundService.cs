using System;
using System.Collections.Generic;

// used for the cpu monitoring
using System.Diagnostics;
using System.IO;
using System.Linq;
// used for the json serialization
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;


public class AnalyticsBackgroundService : BackgroundService
{
    private readonly string DataFilePath = Path.Combine(AppContext.BaseDirectory, "data.json");
    private readonly List<string> SecurityEvents = new()
    {
        "No threats detected",
        "Suspicious process found: malware.exe",
        "Firewall block: Unauthorized outbound connection",
        "Security scan completed"
    };

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        Console.WriteLine("🔒 PC Protection Service (Background Analytics) started...");

        var prevCpuTime = Process.GetCurrentProcess().TotalProcessorTime;
        var prevTime = DateTime.UtcNow;

        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.UtcNow;
            var process = Process.GetCurrentProcess();
            var cpuTime = process.TotalProcessorTime;

            // approximate cpu usage for this process over interval
            var cpuUsedPercent = ((cpuTime - prevCpuTime).TotalMilliseconds / (Environment.ProcessorCount * (now - prevTime).TotalMilliseconds)) * 100;

            // updating the vale for the next calculation
            prevCpuTime = cpuTime;
            prevTime = now;


            // calculating the memory in gb
            var memoryUsedGb = process.WorkingSet64 / (1024.0 * 1024 * 1024);

            var entry = new AnalyticsEntry
            {
                Timestamp = now,
                CpuUsedPercent = cpuUsedPercent,
                MemoryUsedGb = memoryUsedGb,
                SecurityEvent = SecurityEvents[new Random().Next(SecurityEvents.Count)]
            };
            // saving the new entry in the data.json file
            await PersistData(entry);

            Console.WriteLine($" {entry.Timestamp}: CPU={entry.CpuUsedPercent:F2}%, Mem={entry.MemoryUsedGb:F2} GB, Event={entry.SecurityEvent}");

            await Task.Delay(15000, stoppingToken); // wating for  15 seconds
        }
    }
    
    
    // it is a helper method to persist the data in the data.json file
    private async Task PersistData(AnalyticsEntry newEntry)
    {
        // empty list to hold the entries
        var entries = new List<AnalyticsEntry>();
         
         // if file exist then read the existing entries and make a list 
        if (File.Exists(DataFilePath))
        {
            var json = await File.ReadAllTextAsync(DataFilePath);
            entries = JsonSerializer.Deserialize<List<AnalyticsEntry>>(json) ?? new List<AnalyticsEntry>();
        }
        // making a new entry and adding it to the list
        entries.Add(newEntry);
        
        // keeping only the last 100 entries only
        if (entries.Count > 100)
            entries = entries.Skip(entries.Count - 100).ToList();

        var newJson = JsonSerializer.Serialize(entries, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(DataFilePath, newJson);
    }
}
